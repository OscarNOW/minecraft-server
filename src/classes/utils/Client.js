const { Entity } = require('./Entity');
const { ChangablePosition } = require('./ChangablePosition');

const windowNameIdMapping = require('../../data/windowNameIdMapping.json');
const languages = require('../../data/languages.json');
const items = require('../../data/items.json');
const particles = require('../../data/particles.json');
const blocks = require('../../data/blocks.json');

const { EventEmitter } = require('events');

const ps = Object.fromEntries([ // privateSymbols
    'canUsed',
    'readyStates',
    'joinedPacketSent',
    'leftPacketSent',
    'client',
    '_respawnScreen',
    '_slot',
    '_darkSky',
    '_gamemode',
    '_health',
    '_food',
    '_foodSaturation',
    '_position',
    'sendPacket',
    'updateCanUsed',
    'emitMove'
].map(name => [name, Symbol(name)]));

function getBlockId(blockName) {
    if (typeof blocks[blockName] == 'number')
        return blocks[blockName]

    if (typeof blocks[blockName] == 'string')
        return getBlockId(blocks[blockName])

    throw new Error(`Unknown blockName "${blockName}" (${typeof blockName})`);
}

class Client extends EventEmitter {
    constructor(client, server, version) {
        super();

        client.write('login', {
            entityId: client.id,
            isHardcore: false,
            gameMode: 0,
            previousGameMode: 255,
            worldNames: mcData.loginPacket.worldNames,
            dimensionCodec: mcData.loginPacket.dimensionCodec,
            dimension: mcData.loginPacket.dimension,
            worldName: 'minecraft:overworld',
            hashedSeed: [0, 0],
            maxPlayers: 0,
            viewDistance: 1000,
            reducedDebugInfo: false,
            enableRespawnScreen: true,
            isDebug: false,
            isFlat: false
        });

        const that = this;

        this[ps.canUsed] = false;
        this[ps.readyStates] = {
            socketOpen: false,
            clientSettings: false
        }
        this[ps.joinedPacketSent] = false;
        this[ps.leftPacketSent] = false;

        this[ps.client] = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this[ps.client].profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE)
            this.textures.cape = textures.CAPE.url;

        this.username = this[ps.client].username;
        this.uuid = this[ps.client].uuid;
        this.entityId = this[ps.client].id;
        this.ping = this[ps.client].latency;
        this.version = version;
        this[ps._respawnScreen] = true;
        this[ps._slot] = null;
        this[ps._darkSky] = false;
        this[ps._gamemode] = 'survival';
        this[ps._health] = 20;
        this[ps._food] = 20;
        this[ps._foodSaturation] = 5;

        this[ps.client].socket.addListener('close', () => {
            this[ps.updateCanUsed]();
        })

        this[ps._position] = new ChangablePosition(i => that.teleport.call(that, i), {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        })

        this.entities = {};

        this.events = [
            'chat',
            'move',
            'leave',
            'slotChange',
            'digStart',
            'digCancel',
            'blockBreak',
            'itemDrop',
            'itemHandSwap'
        ]

        this[ps.client].on('block_dig', ({ status, location: { x, y, z }, face }) => {
            let faces = {
                0: '-Y',
                1: '+Y',
                2: '-Z',
                3: '+Z',
                4: '-X',
                5: '+X'
            };

            if (status == 1 && !faces[face])
                throw new Error(`Unknown face "face" (${typeof face})`)

            if (status == 0)
                this.emit('digStart', { x, y, z }, faces[face])
            else if (status == 1)
                this.emit('digCancel', { x, y, z })
            else if (status == 2)
                this.emit('blockBreak', { x, y, z })
            else if (status == 3)
                this.emit('itemDrop', true)
            else if (status == 4)
                this.emit('itemDrop', false)
            else if (status == 5)
                throw new Error('Not implemented')
            else if (status == 6)
                this.emit('itemHandSwap')
            else
                throw new Error(`Unknown status "${status}" (${typeof status})`)
        })

        this[ps.client].on('use_entity', obj => {
            if (!this.entities[obj.target]) throw new Error(`Unknown target "${obj.target}" (${typeof obj.target})`)

            if (obj.mouse == 2) {
                if (obj.hand != 0 && obj.hand != 1) throw new Error(`Unknown hand "${obj.hand}" (${typeof obj.hand})`)
                this.entities[obj.target].events.rightClick.forEach(val => {
                    val(
                        {
                            x: obj.x,
                            y: obj.y,
                            z: obj.z
                        },
                        obj.hand == 0 ? this.mainHand : (this.mainHand == 'left' ? 'right' : 'left')
                    )
                })
            } else if (obj.mouse == 0)
                return
            else if (obj.mouse == 1)
                this.entities[obj.target].events.leftClick.forEach(val => { val() })
            else
                throw new Error(`Unknown mouse "${obj.mouse}" (${typeof obj.mouse})`)
        })

        this[ps.client].on('chat', ({ message }) => {
            this.emit('chat', message);
        })

        this[ps.client].on('held_item_slot', ({ slotId }) => {
            if (slotId < 0 || slotId > 8)
                throw new Error(`Unknown slotId "${slotId}" (${typeof slotId})`)

            this[ps._slot] = slotId + 1;
            this.emit('slotChange');
        })

        this[ps.client].on('position', i => this[ps.emitMove].call(this, i));
        this[ps.client].on('position_look', i => this[ps.emitMove].call(this, i));
        this[ps.client].on('look', i => this[ps.emitMove].call(this, i));
        this[ps.client].on('flying', i => this[ps.emitMove].call(this, i));

        this[ps.client].on('settings', ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) => {
            let langCode = locale.toLowerCase();
            if (!languages[langCode]) throw new Error(`Unknown language code "${langCode}" (${typeof langCode})`)
            let obj = languages[langCode];
            obj.langCode = langCode;

            this.locale = obj;
            this.viewDistance = viewDistance;

            if (chatFlags === 0)
                this.chatSettings = {
                    visible: 'all',
                    colors: chatColors
                };
            else if (chatFlags === 1)
                this.chatSettings = {
                    visible: 'commands',
                    colors: chatColors
                };
            else if (chatFlags === 2)
                this.chatSettings = {
                    visible: 'none',
                    colors: chatColors
                };
            else
                throw new Error(`Unknown chatFlags "${chatFlags}" (${typeof chatFlags})`)

            let bsp = Number(skinParts).toString(2).padStart(7, '0').split('').map(bit => Number(bit) === 1);
            this.visibleSkinParts = {
                cape: bsp[6],
                torso: bsp[5],
                leftArm: bsp[4],
                rightArm: bsp[3],
                leftLeg: bsp[2],
                rightLeg: bsp[1],
                hat: bsp[0]
            }

            if (mainHand === 0)
                this.mainHand = 'left'
            else if (mainHand === 1)
                this.mainHand = 'right'
            else
                throw new Error(`Unknown mainHand "${mainHand}" (${typeof mainHand})`)

            this[ps.readyStates].clientSettings = true;
            this[ps.updateCanUsed]();
        })

        this[ps.sendPacket] = (name, packet) => this[ps.client].write(name, packet);
        this[ps.updateCanUsed] = () => {
            this[ps.readyStates].socketOpen = this.online;
            let canUsed = true;
            for (const val of Object.values(this[ps.readyStates]))
                if (!val) canUsed = false;

            this[ps.canUsed] = canUsed;
            if (this[ps.canUsed] && !this[ps.joinedPacketSent] && !this[ps.leftPacketSent]) {
                this[ps.joinedPacketSent] = true;

                this.server.clients.push(this);
                this.server.emit('join', this);

            } else if (!canUsed && !this[ps.leftPacketSent] && this[ps.joinedPacketSent]) {
                this[ps.leftPacketSent] = true;

                this.server.clients = this.server.clients.filter(client => client.canUsed);
                this.emit('leave');
                this.server.emit('leave', this);
            }
        }
        this[ps.emitMove] = info => {
            let changed = false;
            [
                'x',
                'y',
                'z',
                'pitch',
                'yaw'
            ].forEach(val => {
                if (info[val] !== undefined && this[ps._position][val] != info[val]) {
                    changed = true;
                    this[ps._position]._[val] = info[val];
                }
            });

            if (changed)
                this.emit('move');
        }
    }

    addListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.on(event, callback);
    }

    once(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event != undefined && !this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.rawListeners(event);
    }

    get respawnScreen() {
        return this[ps._respawnScreen];
    }

    set respawnScreen(respawnScreen) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (respawnScreen !== true && respawnScreen !== false)
            throw new Error(`Unknown respawnScreen, expected true or false, received "${respawnScreen}" (${typeof respawnScreen})`)

        this[ps.sendPacket]('game_state_change', {
            reason: 11,
            gameMode: respawnScreen ? 0 : 1
        })

        this[ps._respawnScreen] = respawnScreen;
    }

    get health() {
        return this[ps._health];
    }

    get food() {
        return this[ps._food];
    }

    get foodSaturation() {
        return this[ps._foodSaturation];
    }

    set health(h) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const health = parseInt(h);

        if (isNaN(health) || health < 0 || health > 20)
            throw new Error(`Unknown health, expected an integer between 0 and 20, received "${h}" (${typeof h})`)

        this[ps.sendPacket]('update_health', {
            health,
            food: this[ps._food],
            foodSaturation: this[ps._foodSaturation]
        })

        this[ps._health] = health;
    }

    set food(f) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const food = parseInt(f);

        if (isNaN(food) || food < 0 || food > 20)
            throw new Error(`Unknown food, expected an integer between 0 and 20, received "${f}" (${typeof f})`)

        this[ps.sendPacket]('update_health', {
            health: this[ps._health],
            food: food,
            foodSaturation: this[ps._foodSaturation]
        })

        this[ps._food] = food;
    }

    set foodSaturation(fs) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const foodSaturation = parseInt(fs);

        if (isNaN(foodSaturation) || foodSaturation < 0 || foodSaturation > 5)
            throw new Error(`Unknown foodSaturation, expected an integer between 0 and 5, received "${fs}" (${typeof fs})`)

        this[ps.sendPacket]('update_health', {
            health: this[ps._health],
            food: this[ps._food],
            foodSaturation: foodSaturation
        })

        this[ps._foodSaturation] = foodSaturation;
    }

    get online() {
        return this[ps.client].socket.readyState == 'open';
    }

    get position() {
        return this[ps._position];
    }

    set position({ x, y, z, yaw, pitch }) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('position', {
            x: x || this.position.x,
            y: y || this.position.y,
            z: z || this.position.z,
            yaw: yaw || this.position.yaw,
            pitch: pitch || this.position.pitch,
            flags: 0x00
        });
    }

    get slot() {
        return this[ps._slot];
    }

    set slot(slot) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (isNaN(parseInt(slot)) || slot < 0 || slot > 8)
            throw new Error(`Unknown slot, expected an integer between 0 and 8, received "${slot}" (${typeof slot})`)

        this[ps.sendPacket]('held_item_slot', {
            slot: parseInt(slot)
        })
    }

    get darkSky() {
        return this[ps._darkSky];
    }

    set darkSky(darkSky) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (darkSky != false && darkSky != true)
            throw new Error(`Unknown darkSky, expected true or false, received "${darkSky}" (${typeof darkSky})`)

        this[ps._darkSky] = darkSky;

        this[ps.sendPacket]('game_state_change', {
            reason: darkSky ? 2 : 1
        })
    }

    get gamemode() {
        return this[ps._gamemode];
    }

    set gamemode(gamemode) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
            throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

        this[ps._gamemode] = gamemode;

        this[ps.sendPacket]('game_state_change', {
            reason: 3,
            gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
        })
    }

    particle(particleName, visibleFromFar, particleAmount, { x, y, z }, spread) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!particles[particleName]) throw new Error(`Unknown particleName "${particleName}" (${typeof particleName})`)

        if (!particles[particleName].requireData)
            this[ps.sendPacket]('world_particles', {
                particleId: particles[particleName].id,
                longDistance: visibleFromFar,
                x,
                y,
                z,
                offsetX: spread.x,
                offsetY: spread.y,
                offsetZ: spread.z,
                particleData: 0,
                particles: particleAmount
            })
        else if (['block', 'block_marker', 'falling_dust'].includes(particleName))
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            blockState: getBlockId(data1)
        }

        block: only barrier??
        block_marker: kicks client: 'expected text to be a string, was an object'
        falling_dust: kicks client: 'expected text to be a string, was an object'
        */

        else if (particleName == 'dust')
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            red: data1.red,
            green: data1.green,
            blue: data1.blue,
            scale: data2
        }

        kicks client: 'expected text to be a string. was an object'
        */

        else if (particleName == 'item')
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            present: true,
            itemId: items[data1].id,
            itemCount: data2
        }

        kicks client: 'expected text to be a string. was an object'
        */

        else if (particleName == 'vibration') //Not in prismarine documentation
            throw new Error('Not implemented')

    }

    explosion(location, playerVelocity, strength, destroyedBlocks) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('explosion', {
            x: location.x,
            y: location.y,
            z: location.z,
            radius: strength,
            affectedBlockOffsets: destroyedBlocks.map(destroyedBlock => ({
                x: destroyedBlock.xOffset,
                y: destroyedBlock.yOffset,
                z: destroyedBlock.zOffset
            })),
            playerMotionX: playerVelocity.x,
            playerMotionY: playerVelocity.y,
            playerMotionZ: playerVelocity.z
        })
    }

    blockBreakAnimation(location, stage) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (stage < 0 || stage > 10)
            throw new Error(`Unknown stage "${stage}" (${typeof stage})`)

        this[ps.sendPacket]('block_break_animation', {
            entityId: Math.floor(Math.random() * 1000),
            location: location,
            destroyStage: stage == 0 ? 10 : stage - 1
        })
    }

    resetCamera() {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('camera', {
            cameraId: this.entityId
        })
    }

    cooldown(item, length = 60) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!items[item])
            throw new Error(`Unknown item "${item}" (${typeof item})`)

        this[ps.sendPacket]('set_cooldown', {
            itemID: items[item].id,
            cooldownTicks: length
        })
    }

    demo(message) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let messages = {
            startScreen: 0,
            movement: 101,
            jump: 102,
            inventory: 103,
            endScreenshot: 104
        };

        if (messages[message] === undefined)
            throw new Error(`Unknown message "${message}" (${typeof message})`)

        this[ps.sendPacket]('game_state_change', {
            reason: 5,
            gameMode: messages[message]
        })
    }

    elderGuardian() {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('game_state_change', {
            reason: 10
        })
    }

    win(hideCredits) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (hideCredits)
            throw new Error('Not implemented')

        this[ps.sendPacket]('game_state_change', {
            reason: 4,
            gameMode: hideCredits ? 0 : 1
        })
    }

    kick(reason) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.client].end(`${reason}`);
    }

    chat(message) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('chat', {
            message: JSON.stringify({ translate: `${message}` }),
            position: 0,
            sender: '0'
        });
    }

    title(properties) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let { fadeIn, stay, fadeOut, title, subTitle } = properties || {};

        this[ps.sendPacket]('title', {
            action: 5
        })

        this[ps.sendPacket]('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this[ps.sendPacket]('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this[ps.sendPacket]('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }

    actionBar(text) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('title', {
            action: 2,
            text: JSON.stringify({ translate: `${text}` })
        })
    }

    chunk(chunk, { x, z }) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[ps.sendPacket]('map_chunk', {
            x,
            z,
            groundUp: true,
            biomes: chunk.chunk.dumpBiomes !== undefined ? chunk.chunk.dumpBiomes() : undefined,
            heightmaps: {
                type: 'compound',
                name: '',
                value: {}
            },
            bitMap: chunk.chunk.getMask(),
            chunkData: chunk.chunk.dump(),
            blockEntities: []
        })
    }

    entity(type, { x, y, z, yaw, pitch }) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch }, this[ps.sendPacket]);

        this.entities[entityId] = entity;
        return entity;
    }

    difficulty(difficulty) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
            throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

        this[ps.sendPacket]('difficulty', {
            difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
            difficultyLocked: true
        })
    }

    window(windowType, horse) {
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}" (${typeof windowType})`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

        let windowId = windowNameIdMapping[windowType];

        if (windowId == 'EntityHorse')
            this[ps.sendPacket]('open_horse_window', {
                windowId: 1,
                nbSlots: 2,
                entityId: horse.id
            })
        else
            throw new Error(`Not implemented`)
    }

    player() {
        throw new Error(`Not implemented`)
        if (!this[ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this[ps.sendPacket]('player_info', {
            action: 0,
            data: [
                {
                    UUID: this.uuid,
                    name: this.username,
                    // properties: inf.properties,
                    properties: [],
                    gamemode: 0,
                    ping: this.ping,
                    displayName: this.username
                }
            ]
        })
        // })
    }
}

module.exports = { Client }