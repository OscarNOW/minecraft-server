const Entity = require('./Entity').Entity;
const { ChangablePosition } = require('./ChangablePosition');

const windowNameIdMapping = require('../../data/windowNameIdMapping.json');
const languages = require('../../data/languages.json');
const items = require('../../data/items.json');
const particles = require('../../data/particles.json');
const blocks = require('../../data/blocks.json');

function getBlockId(blockName) {
    if (typeof blocks[blockName] == 'number')
        return blocks[blockName]

    if (typeof blocks[blockName] == 'string')
        return getBlockId(blocks[blockName])

    throw new Error(`Unknown blockName "${blockName}" (${typeof blockName})`);
}

class Client {
    constructor(client, server, version) {
        const that = this;

        this.canUsed = false;
        this.readyStates = {
            socketOpen: false,
            clientSettings: false
        }
        this.joinedPacketSent = false;
        this.leftPacketSent = false;

        this.client = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this.client.profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE)
            this.textures.cape = textures.CAPE.url;

        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.entityId = this.client.id;
        this.ping = this.client.latency;
        this.version = version;
        this._respawnScreen = true;
        this._slot = null;
        this._darkSky = false;
        this._gamemode = 'survival';
        this._health = 20;
        this._food = 20;
        this._foodSaturation = 5;

        this.client.socket.addListener('close', () => {
            this.updateCanUsed();
        })

        this._position = new ChangablePosition(i => that.teleport.call(that, i), {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        })

        this.entities = {};

        this.events = {
            chat: [],
            move: [],
            leave: [],
            slotChange: [],
            digStart: [],
            digCancel: [],
            blockBreak: [],
            itemDrop: [],
            itemHandSwap: []
        }

        this.client.on('block_dig', ({ status, location: { x, y, z }, face }) => {
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
                this.events.digStart.forEach(val => {
                    val({ x, y, z }, faces[face])
                })
            else if (status == 1)
                this.events.digCancel.forEach(val => {
                    val({ x, y, z })
                })
            else if (status == 2)
                this.events.blockBreak.forEach(val => {
                    val({ x, y, z })
                })
            else if (status == 3)
                this.events.itemDrop.forEach(val => {
                    val(true)
                })
            else if (status == 4)
                this.events.itemDrop.forEach(val => {
                    val(false)
                })
            else if (status == 5)
                throw new Error('Not implemented')
            else if (status == 6)
                this.events.itemHandSwap.forEach(val => val())
            else
                throw new Error(`Unknown status "${status}" (${typeof status})`)
        })

        this.client.on('use_entity', obj => {
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

        this.client.on('chat', ({ message }) => {
            this.events.chat.forEach(val => {
                val(message);
            })
        })

        this.client.on('held_item_slot', ({ slotId }) => {
            if (slotId < 0 || slotId > 8)
                throw new Error(`Unknown slotId "${slotId}" (${typeof slotId})`)

            this._slot = slotId + 1;
            this.events.slotChange.forEach(val => val());
        })

        this.client.on('position', i => this.emitMove.call(this, i));
        this.client.on('position_look', i => this.emitMove.call(this, i));
        this.client.on('look', i => this.emitMove.call(this, i));
        this.client.on('flying', i => this.emitMove.call(this, i));

        this.client.on('settings', ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) => {
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

            this.readyStates.clientSettings = true;
            this.updateCanUsed();
        })

    }

    updateCanUsed() {
        this.readyStates.socketOpen = this.online;
        let canUsed = true;
        for (const val of Object.values(this.readyStates))
            if (!val) canUsed = false;

        this.canUsed = canUsed;
        if (this.canUsed && !this.joinedPacketSent && !this.leftPacketSent) {
            this.joinedPacketSent = true;

            this.server.clients.push(this);
            this.server.events.join.forEach(val => val(this));

        } else if (!canUsed && !this.leftPacketSent && this.joinedPacketSent) {
            this.leftPacketSent = true;

            this.server.clients = this.server.clients.filter(client => client.canUsed);
            this.events.leave.forEach(val => {
                val();
            });
            this.server.events.leave.forEach(val => {
                val(this);
            });
        }
    }

    get respawnScreen() {
        return this._respawnScreen;
    }

    set respawnScreen(respawnScreen) {
        if (respawnScreen !== true && respawnScreen !== false)
            throw new Error(`Expected respawnScreen to be a boolean, received "${respawnScreen}" (${typeof respawnScreen})`)

        this.client.write('game_state_change', {
            reason: 11,
            gameMode: respawnScreen ? 0 : 1
        })

        this._respawnScreen = respawnScreen;
    }

    get health() {
        return this._health;
    }

    get food() {
        return this._food;
    }

    get foodSaturation() {
        return this._foodSaturation;
    }

    set health(h) {
        const health = parseInt(h);

        if (isNaN(health) || health < 0 || health > 20)
            throw new Error(`Health must be an integer between 0 and 20, received "${h}" (${typeof h})`)

        this.client.write('update_health', {
            health,
            food: this._food,
            foodSaturation: this._foodSaturation
        })

        this._health = health;
    }

    set food(f) {
        const food = parseInt(f);

        if (isNaN(food) || food < 0 || food > 20)
            throw new Error(`Food must be an integer between 0 and 20, received "${f}" (${typeof f})`)

        this.client.write('update_health', {
            health: this._health,
            food: food,
            foodSaturation: this._foodSaturation
        })

        this._food = food;
    }

    set foodSaturation(fs) {
        const foodSaturation = parseInt(fs);

        if (isNaN(foodSaturation) || foodSaturation < 0 || foodSaturation > 5)
            throw new Error(`Food must be an integer between 0 and 5, received "${fs}" (${typeof fs})`)

        this.client.write('update_health', {
            health: this._health,
            food: this._food,
            foodSaturation: foodSaturation
        })

        this._foodSaturation = foodSaturation;
    }

    get online() {
        return this.client.socket.readyState == 'open';
    }

    get position() {
        return this._position;
    }

    set position(val) {
        this.teleport(val);
    }

    get slot() {
        return this._slot;
    }

    set slot(slot) {
        if (isNaN(parseInt(slot)) || slot < 0 || slot > 8)
            throw new Error(`Unknown slot "${slot}" (${typeof slot})`)

        this.client.write('held_item_slot', {
            slot: parseInt(slot)
        })
    }

    get darkSky() {
        return this._darkSky;
    }

    set darkSky(darkSky) {
        if (darkSky != false && darkSky != true)
            throw new Error(`Expected darkSky to be a boolean, received "${darkSky}" (${typeof darkSky})`)

        this._darkSky = darkSky;

        this.client.write('game_state_change', {
            reason: darkSky ? 2 : 1
        })
    }

    get gamemode() {
        return this._gamemode;
    }

    set gamemode(gamemode) {
        if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
            throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

        this._gamemode = gamemode;

        this.client.write('game_state_change', {
            reason: 3,
            gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
        })
    }

    particle(particleName, visibleFromFar, particleAmount, { x, y, z }, spread, data1, data2, data3) {
        if (!particles[particleName]) throw new Error(`Unknown particleName "${particleName}" (${typeof particleName})`)

        if (!particles[particleName].requireData)
            this.client.write('world_particles', {
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
        this.client.write('explosion', {
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
        if (stage < 0 || stage > 10)
            throw new Error(`Unknown stage "${stage}" (${typeof stage})`)

        this.client.write('block_break_animation', {
            entityId: Math.floor(Math.random() * 1000),
            location: location,
            destroyStage: stage == 0 ? 10 : stage - 1
        })
    }

    resetCamera() {
        this.client.write('camera', {
            cameraId: this.entityId
        })
    }

    cooldown(item, length = 60) {
        if (!items[item])
            throw new Error(`Unknown item "${item}" (${typeof item})`)

        this.client.write('set_cooldown', {
            itemID: items[item].id,
            cooldownTicks: length
        })
    }

    kill() {
        this.health = 0;
    }

    demo(message) {
        let messages = {
            startScreen: 0,
            movement: 101,
            jump: 102,
            inventory: 103,
            endScreenshot: 104
        };

        if (messages[message] === undefined)
            throw new Error(`Unknown message "${message}" (${typeof message})`)

        this.client.write('game_state_change', {
            reason: 5,
            gameMode: messages[message]
        })
    }

    elderGuardian() {
        this.client.write('game_state_change', {
            reason: 10
        })
    }

    win(hideCredits) {
        if (hideCredits)
            throw new Error('Not implemented')

        this.client.write('game_state_change', {
            reason: 4,
            gameMode: hideCredits ? 0 : 1
        })
    }

    emitMove(info) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let changed = false;
        [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ].forEach(val => {
            if (info[val] !== undefined && this._position[val] != info[val]) {
                changed = true;
                this._position._[val] = info[val];
            }
        });

        if (changed)
            this.events.move.forEach(val => {
                val();
            })
    }

    on(event, callback) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!this.events[event]) throw new Error(`Unknown event "${event}" (${typeof event})`)
        this.events[event].push(callback);
    }

    kick(reason) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.client.end(`${reason}`);
    }

    chat(message) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('chat', {
            message: JSON.stringify({ translate: `${message}` }),
            position: 0,
            sender: '0'
        });
    }

    title(properties) {
        let { fadeIn, stay, fadeOut, title, subTitle } = properties || {};

        this.client.write('title', {
            action: 5
        })

        this.client.write('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this.client.write('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this.client.write('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }

    actionBar(text) {
        this.client.write('title', {
            action: 2,
            text: JSON.stringify({ translate: `${text}` })
        })
    }

    chunk(chunk, { x, z }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('map_chunk', {
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

    teleport({ x, y, z, yaw, pitch }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('position', {
            x,
            y,
            z,
            yaw,
            pitch,
            flags: 0x00
        });
    }

    entity(type, { x, y, z, yaw, pitch }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch });

        this.entities[entityId] = entity;
        return entity;
    }

    difficulty(difficulty) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
            throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

        this.client.write('difficulty', {
            difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
            difficultyLocked: true
        })
    }

    window(windowType, horse) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}" (${typeof windowType})`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

        let windowId = windowNameIdMapping[windowType];

        if (windowId == 'EntityHorse')
            this.client.write('open_horse_window', {
                windowId: 1,
                nbSlots: 2,
                entityId: horse.id
            })
        else
            throw new Error(`Not implemented`)
    }

    player() {
        throw new Error(`Not implemented`)
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this.client.write('player_info', {
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