const { ChangablePosition } = require('./ChangablePosition');

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
    '_difficulty',
    'sendPacket',
    'updateCanUsed',
    'emitMove'
].map(name => [name, Symbol(name)]));

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
        this[this.ps._difficulty] = 'normal'

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

        for (const [key, value] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/events/'))
                .filter(a => a.endsWith('.js'))
                .map(a => require(`./Client/events/${a}`))
            )
        ))
            this[this.ps.client].on(key, value.bind(this))

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

    get food() {
        return this[this.ps._food];
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

    get foodSaturation() {
        return this[this.ps._foodSaturation];
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

    get difficulty() {
        return this[this.ps._difficulty];
    }

    set difficulty(difficulty) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
            throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

        this[this.ps.sendPacket]('difficulty', {
            difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
            difficultyLocked: true
        })

        this[this.ps._difficulty] = difficulty;
    }
}

module.exports = { Client }