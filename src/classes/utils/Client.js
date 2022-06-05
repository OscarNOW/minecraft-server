const version = require('../../data/version.json');

const mcData = require('minecraft-data')(version)
const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

const _p = Symbol('_privates');

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

        this[_p] = {};

        this.p.client = client;
        this.server = server;
        this.version = version;

        this.p.canUsed = false;
        this.p.readyStates = {
            socketOpen: false,
            clientSettings: false
        }
        this.p.joinedPacketSent = false;
        this.p.leftPacketSent = false;

        this.p.observables = observables;
        this.entities = {};

        this.p.client.socket.addListener('close', () => {
            this.p.updateCanUsed();
        });

        this.p.updateCanUsed = () => {
            this.p.readyStates.socketOpen = this.online;
            let canUsed = true;
            for (const val of Object.values(this.p.readyStates))
                if (!val) canUsed = false;

            this.p.canUsed = canUsed;
            if (this.p.canUsed && !this.p.joinedPacketSent && !this.p.leftPacketSent) {
                this.p.joinedPacketSent = true;

                this.server.clients.push(this);
                this.server.emit('join', this);

            } else if (!canUsed && !this.p.leftPacketSent && this.p.joinedPacketSent) {
                this.p.leftPacketSent = true;

                this.server.clients = this.server.clients.filter(client => client.canUsed);
                this.emit('leave');
                this.server.emit('leave', this);
            }
        }

        //Inject private methods
        Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/methods/private/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/methods/private/${v}`))
            )
        ).forEach(([key, value]) =>
            this.p[key] = value.bind(this)
        )

        //Inject private static properties
        Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/properties/private/static/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/properties/private/static/${v}`))
            )
        ).forEach(([key, value]) =>
            this.p[key] = value
        )

        //Inject public methods
        Object.defineProperties(this,
            Object.fromEntries(
                Object.entries(
                    Object.assign({}, ...fs
                        .readdirSync(path.resolve(__dirname, './Client/methods/public/'))
                        .filter(v => v.endsWith('.js'))
                        .map(v => require(`./Client/methods/public/${v}`))
                    )
                )
                    .map(([name, value]) => [name, {
                        configurable: false,
                        enumerable: true,
                        writable: false,
                        value
                    }])
            )
        )

        //Inject public static properties
        Object.defineProperties(this,
            Object.fromEntries(
                Object.entries(
                    Object.assign({}, ...fs
                        .readdirSync(path.resolve(__dirname, './Client/properties/public/static/'))
                        .filter(v => v.endsWith('.js'))
                        .map(v => require(`./Client/properties/public/static/${v}`))
                    )
                )
                    .map(([name, get]) => [name, {
                        configurable: false,
                        enumerable: true,
                        writable: false,
                        value: get.call(this)
                    }])
            )
        );

        //Initialize public dynamic properties
        for (const { init } of Object.values(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/properties/public/dynamic/${v}`))
            )
        ))
            init?.call?.(this);

        //Inject public dynamic properties
        Object.defineProperties(this,
            Object.fromEntries(
                Object.entries(
                    Object.assign({}, ...fs
                        .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
                        .filter(v => v.endsWith('.js'))
                        .map(v => require(`./Client/properties/public/dynamic/${v}`))
                    )
                )
                    .map(([name, { get, set }]) => [name, {
                        configurable: false,
                        enumerable: true,
                        get: get?.bind?.(this),
                        set: set?.bind?.(this)
                    }])
            )
        )

        //Inject events
        for (const [eventName, eventCallback] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/events/'))
                .filter(a => a.endsWith('.js'))
                .map(a => require(`./Client/events/${a}`))
            )
        ))
            this.p.client.on(eventName, eventCallback.bind(this))


        this.p.sendPacket('login', {
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

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (callPath.startsWith(folderPath))
            return this[_p];
        else {
            return undefined;
        }
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
}

module.exports = Object.freeze({ Client })