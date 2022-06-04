const { ChangablePosition } = require('./ChangablePosition');

const version = require('../../data/version.json');

const mcData = require('minecraft-data')(version)
const { EventEmitter } = require('events');
const { inject } = require('../../functions/inject.js');
const fs = require('fs');
const path = require('path');

const globalGet = Object.assign({},
    Object.entries(
        fs
            .readdirSync(path.resolve(__dirname, './Client/properties/dynamic/'))
            .filter(v => v.endsWith('.js'))
            .map(v => v.split('.js')[0])
            .map(v => require(`./Client/properties/dynamic/${v}`))
            .reduce((a, b) => ({ ...a, ...b }))
    )
        .map(([name, { get, set }]) => Object.fromEntries([[name, get]]))
        .reduce((a, b) => ({ ...a, ...b }))
);

const globalSet = Object.assign({},
    Object.entries(
        fs
            .readdirSync(path.resolve(__dirname, './Client/properties/dynamic/'))
            .filter(v => v.endsWith('.js'))
            .map(v => v.split('.js')[0])
            .map(v => require(`./Client/properties/dynamic/${v}`))
            .reduce((a, b) => ({ ...a, ...b }))
    )
        .map(([name, { get, set }]) => Object.fromEntries([[name, set]]))
        .reduce((a, b) => ({ ...a, ...b }))
);

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
    'emitMove',
    'observables',
    'emitObservable',
    'get',
    'set'
].map(name => [name, Symbol(name)]));

const events = Object.freeze([
    'chat',
    'leave',
    'digStart',
    'digCancel',
    'blockBreak',
    'itemDrop',
    'itemHandSwap'
]);

const observables = Object.freeze(Object.fromEntries([
    'position',
    'slot',
    'health',
    'food',
    'foodSaturation',
    'darkSky',
    'respawnScreen',
    'gamemode',
    'difficulty'
].map(v => [v, []])));

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

        this[this.ps.observables] = observables;

        this[this.ps.get] = Object.fromEntries(Object.entries(globalGet).map(v => [v[0], v[1].bind(this)]))
        this[this.ps.set] = Object.fromEntries(Object.entries(globalSet).map(v => [v[0], v[1].bind(this)]))

        this[this.ps.client] = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this[this.ps.client].profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE) this.textures.cape = textures.CAPE.url;
        Object.freeze(this.textures);

        this.username = this[this.ps.client].username;
        this.uuid = this[this.ps.client].uuid;
        this.entityId = this[this.ps.client].id;
        this.ping = this[this.ps.client].latency;
        this.version = version;
        this[this.ps._respawnScreen] = true;
        this[this.ps._slot] = 0;
        this[this.ps._darkSky] = false;
        this[this.ps._gamemode] = 'survival';
        this[this.ps._health] = 20;
        this[this.ps._food] = 20;
        this[this.ps._foodSaturation] = 5;
        this[this.ps._difficulty] = 'normal';

        this[this.ps.client].socket.addListener('close', () => {
            this[this.ps.updateCanUsed]();
        });

        this[this.ps._position] = new ChangablePosition(i => that.position = i, {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        });

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
                this[this.ps.emitObservable]('position');
        }

        this[this.ps.emitObservable] = type => {
            this[this.ps.observables][type].forEach(cb => cb())
        }


        inject(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/functions/public/'))
                .filter(a => a.endsWith('.js'))
                .map(a => require(`./Client/functions/public/${a}`))
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

    observe(observable, cb) {
        if (!this[this.ps.observables][observable])
            throw new Error(`Unknown observable "${observable}" (${typeof observable})`);

        this[this.ps.observables][observable].push(cb);
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
        else {
            return undefined;
        }
    }

    get online() {
        return this[this.ps.client].socket.readyState == 'open';
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
        return this[this.ps.get]['respawnScreen']();
    }

    set respawnScreen(v) {
        return this[this.ps.set]['respawnScreen'](v);
    }

    get health() {
        return this[this.ps.get]['health']();
    }

    set health(v) {
        return this[this.ps.set]['health'](v);
    }

    get food() {
        return this[this.ps.get]['food']();
    }

    set food(v) {
        return this[this.ps.set]['food'](v);
    }

    get foodSaturation() {
        return this[this.ps.get]['foodSaturation']();
    }

    set foodSaturation(v) {
        return this[this.ps.set]['foodSaturation'](v);
    }

    get position() {
        return this[this.ps.get]['position']();
    }

    set position(v) {
        return this[this.ps.set]['position'](v);
    }

    get slot() {
        return this[this.ps.get]['slot']();
    }

    set slot(v) {
        return this[this.ps.set]['slot'](v);
    }

    get darkSky() {
        return this[this.ps.get]['darkSky']();
    }

    set darkSky(v) {
        return this[this.ps.set]['darkSky'](v);
    }

    get gamemode() {
        return this[this.ps.get]['gamemode']();
    }

    set gamemode(v) {
        return this[this.ps.set]['gamemode'](v);
    }

    get difficulty() {
        return this[this.ps.get]['difficulty']();
    }

    set difficulty(v) {
        return this[this.ps.set]['difficulty'](v);
    }
}

module.exports = Object.freeze({ Client })