const { Entity } = require('./Entity');
const { ChangablePosition } = require('./ChangablePosition');

const windowNameIdMapping = require('../../data/windowNameIdMapping.json');
const languages = require('../../data/languages.json');
const items = require('../../data/items.json');
const particles = require('../../data/particles.json');
const blocks = require('../../data/blocks.json');
const version = require('../../data/version.json');

const mcData = require('minecraft-data')(version)
const { EventEmitter } = require('events');
const { inject } = require('../../functions/inject.js');
const fs = require('fs');
const path = require('path');

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

const events = [
    'chat',
    'move',
    'leave',
    'slotChange',
    'digStart',
    'digCancel',
    'blockBreak',
    'itemDrop',
    'itemHandSwap'
];

class Client extends EventEmitter {
    constructor(client, server, version) {
        super();
        const that = this;

        this[this.ps.canUsed] = false;
        this[this.ps.readyStates] = {
            socketOpen: false,
            clientSettings: false
        }
        this[this.ps.joinedPacketSent] = false;
        this[this.ps.leftPacketSent] = false;

        this[this.ps.client] = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this[this.ps.client].profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE)
            this.textures.cape = textures.CAPE.url;

        this.username = this[this.ps.client].username;
        this.uuid = this[this.ps.client].uuid;
        this.entityId = this[this.ps.client].id;
        this.ping = this[this.ps.client].latency;
        this.version = version;
        this[this.ps._respawnScreen] = true;
        this[this.ps._slot] = null;
        this[this.ps._darkSky] = false;
        this[this.ps._gamemode] = 'survival';
        this[this.ps._health] = 20;
        this[this.ps._food] = 20;
        this[this.ps._foodSaturation] = 5;

        this[this.ps.client].socket.addListener('close', () => {
            this[this.ps.updateCanUsed]();
        })

        this[this.ps._position] = new ChangablePosition(i => that.teleport.call(that, i), {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        })

        this.entities = {};

        this[this.ps.sendPacket] = (name, packet) => this[this.ps.client].write(name, packet);
        this[this.ps.updateCanUsed] = () => {
            this[this.ps.readyStates].socketOpen = this.online;
            let canUsed = true;
            for (const val of Object.values(this[this.ps.readyStates]))
                if (!val) canUsed = false;

            this[this.ps.canUsed] = canUsed;
            if (this[this.ps.canUsed] && !this[this.ps.joinedPacketSent] && !this[this.ps.leftPacketSent]) {
                this[this.ps.joinedPacketSent] = true;

                this.server.clients.push(this);
                this.server.emit('join', this);

            } else if (!canUsed && !this[this.ps.leftPacketSent] && this[this.ps.joinedPacketSent]) {
                this[this.ps.leftPacketSent] = true;

                this.server.clients = this.server.clients.filter(client => client.canUsed);
                this.emit('leave');
                this.server.emit('leave', this);
            }
        }
        this[this.ps.emitMove] = info => {
            let changed = false;
            [
                'x',
                'y',
                'z',
                'pitch',
                'yaw'
            ].forEach(val => {
                if (info[val] !== undefined && this[this.ps._position][val] != info[val]) {
                    changed = true;
                    this[this.ps._position]._[val] = info[val];
                }
            });

            if (changed)
                this.emit('move');
        }


        inject(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/'))
                .filter(a => a.endsWith('.js'))
                .map(a => require(`./Client/${a}`))
            )
            , this);

        this[this.ps.sendPacket]('login', {
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

        this[this.ps.client].on('block_dig', ({ status, location: { x, y, z }, face }) => {
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

        this[this.ps.client].on('use_entity', obj => {
            if (!this.entities[obj.target]) throw new Error(`Unknown target "${obj.target}" (${typeof obj.target})`)

            if (obj.mouse == 2) {
                if (obj.hand != 0 && obj.hand != 1) throw new Error(`Unknown hand "${obj.hand}" (${typeof obj.hand})`)
                this.entities[obj.target].emit('rightClick', {
                    x: obj.x,
                    y: obj.y,
                    z: obj.z
                }, obj.hand == 0)
            } else if (obj.mouse == 0)
                return
            else if (obj.mouse == 1)
                this.entities[obj.target].emit('leftClick');
            else
                throw new Error(`Unknown mouse "${obj.mouse}" (${typeof obj.mouse})`)
        })

        this[this.ps.client].on('chat', ({ message }) => {
            this.emit('chat', message);
        })

        this[this.ps.client].on('held_item_slot', ({ slotId }) => {
            if (slotId < 0 || slotId > 8)
                throw new Error(`Unknown slotId "${slotId}" (${typeof slotId})`)

            this[this.ps._slot] = slotId + 1;
            this.emit('slotChange');
        })

        this[this.ps.client].on('position', i => this[this.ps.emitMove].call(this, i));
        this[this.ps.client].on('position_look', i => this[this.ps.emitMove].call(this, i));
        this[this.ps.client].on('look', i => this[this.ps.emitMove].call(this, i));
        this[this.ps.client].on('flying', i => this[this.ps.emitMove].call(this, i));

        this[this.ps.client].on('settings', ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) => {
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
                this.rightHanded = false
            else if (mainHand === 1)
                this.rightHanded = true
            else
                throw new Error(`Unknown mainHand "${mainHand}" (${typeof mainHand})`)

            this[this.ps.readyStates].clientSettings = true;
            this[this.ps.updateCanUsed]();
        })
    }

    get ps() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (callPath.startsWith(folderPath))
            return ps;
        else
            return undefined;
    }

    addListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.on(event, callback);
    }

    once(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event != undefined && !events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.rawListeners(event);
    }

    get respawnScreen() {
        return this[this.ps._respawnScreen];
    }

    set respawnScreen(respawnScreen) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (respawnScreen !== true && respawnScreen !== false)
            throw new Error(`Unknown respawnScreen, expected true or false, received "${respawnScreen}" (${typeof respawnScreen})`)

        this[this.ps.sendPacket]('game_state_change', {
            reason: 11,
            gameMode: respawnScreen ? 0 : 1
        })

        this[this.ps._respawnScreen] = respawnScreen;
    }

    get health() {
        return this[this.ps._health];
    }

    get food() {
        return this[this.ps._food];
    }

    get foodSaturation() {
        return this[this.ps._foodSaturation];
    }

    set health(h) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const health = parseInt(h);

        if (isNaN(health) || health < 0 || health > 20)
            throw new Error(`Unknown health, expected an integer between 0 and 20, received "${h}" (${typeof h})`)

        this[this.ps.sendPacket]('update_health', {
            health,
            food: this[this.ps._food],
            foodSaturation: this[this.ps._foodSaturation]
        })

        this[this.ps._health] = health;
    }

    set food(f) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const food = parseInt(f);

        if (isNaN(food) || food < 0 || food > 20)
            throw new Error(`Unknown food, expected an integer between 0 and 20, received "${f}" (${typeof f})`)

        this[this.ps.sendPacket]('update_health', {
            health: this[this.ps._health],
            food: food,
            foodSaturation: this[this.ps._foodSaturation]
        })

        this[this.ps._food] = food;
    }

    set foodSaturation(fs) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        const foodSaturation = parseInt(fs);

        if (isNaN(foodSaturation) || foodSaturation < 0 || foodSaturation > 5)
            throw new Error(`Unknown foodSaturation, expected an integer between 0 and 5, received "${fs}" (${typeof fs})`)

        this[this.ps.sendPacket]('update_health', {
            health: this[this.ps._health],
            food: this[this.ps._food],
            foodSaturation: foodSaturation
        })

        this[this.ps._foodSaturation] = foodSaturation;
    }

    get online() {
        return this[this.ps.client].socket.readyState == 'open';
    }

    get position() {
        return this[this.ps._position];
    }

    set position({ x, y, z, yaw, pitch }) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.sendPacket]('position', {
            x: x || this.position.x,
            y: y || this.position.y,
            z: z || this.position.z,
            yaw: yaw || this.position.yaw,
            pitch: pitch || this.position.pitch,
            flags: 0x00
        });
    }

    get slot() {
        return this[this.ps._slot];
    }

    set slot(slot) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (isNaN(parseInt(slot)) || slot < 0 || slot > 8)
            throw new Error(`Unknown slot, expected an integer between 0 and 8, received "${slot}" (${typeof slot})`)

        this[this.ps.sendPacket]('held_item_slot', {
            slot: parseInt(slot)
        })
    }

    get darkSky() {
        return this[this.ps._darkSky];
    }

    set darkSky(darkSky) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (darkSky != false && darkSky != true)
            throw new Error(`Unknown darkSky, expected true or false, received "${darkSky}" (${typeof darkSky})`)

        this[this.ps._darkSky] = darkSky;

        this[this.ps.sendPacket]('game_state_change', {
            reason: darkSky ? 2 : 1
        })
    }

    get gamemode() {
        return this[this.ps._gamemode];
    }

    set gamemode(gamemode) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
            throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

        this[this.ps._gamemode] = gamemode;

        this[this.ps.sendPacket]('game_state_change', {
            reason: 3,
            gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
        })
    }

    win(hideCredits) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (hideCredits)
            throw new Error('Not implemented')

        this[this.ps.sendPacket]('game_state_change', {
            reason: 4,
            gameMode: hideCredits ? 0 : 1
        })
    }

    kick(reason) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.client].end(`${reason}`);
    }

    chat(message) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.sendPacket]('chat', {
            message: JSON.stringify({ translate: `${message}` }),
            position: 0,
            sender: '0'
        });
    }

    title(properties) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let { fadeIn, stay, fadeOut, title, subTitle } = properties || {};

        this[this.ps.sendPacket]('title', {
            action: 5
        })

        this[this.ps.sendPacket]('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this[this.ps.sendPacket]('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this[this.ps.sendPacket]('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }

    actionBar(text) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.sendPacket]('title', {
            action: 2,
            text: JSON.stringify({ translate: `${text}` })
        })
    }

    chunk(chunk, { x, z }) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.sendPacket]('map_chunk', {
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
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch }, this[this.ps.sendPacket]);

        this.entities[entityId] = entity;
        return entity;
    }

    difficulty(difficulty) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
            throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

        this[this.ps.sendPacket]('difficulty', {
            difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
            difficultyLocked: true
        })
    }

    window(windowType, horse) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}" (${typeof windowType})`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

        let windowId = windowNameIdMapping[windowType];

        if (windowId == 'EntityHorse')
            this[this.ps.sendPacket]('open_horse_window', {
                windowId: 1,
                nbSlots: 2,
                entityId: horse.id
            })
        else
            throw new Error(`Not implemented`)
    }

    player() {
        throw new Error(`Not implemented`)
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this[this.ps.sendPacket]('player_info', {
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