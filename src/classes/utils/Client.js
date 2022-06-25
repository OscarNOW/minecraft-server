const version = require('../../data/version.json');
const dimensionCodec = require('../../data/dimensionCodec.json')

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

class Client extends EventEmitter {
    constructor(client, server, { version, connection: { host, port } }, defaultClientProperties = () => ({})) {
        super();

        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        })

        this.p.client = client;
        this.server = server;
        this.version = version;

        this.p.client.socket.addListener('close', () => {
            this.p.updateCanUsed();
        });

        //Inject private static properties
        Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/properties/private/static/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/properties/private/static/${v}`))
            )
        ).forEach(([key, value]) =>
            this.p[key] = value.call(this)
        )

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
                        value: value.bind(this)
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
        let pubDynProperties = Object.assign({}, ...fs
            .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
            .filter(v => v.endsWith('.js'))
            .map(v => require(`./Client/properties/public/dynamic/${v}`))
        );

        Object.defineProperties(this,
            Object.fromEntries(
                Object.entries(pubDynProperties)
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

        //Set default public dynamic properties
        this.p.defaultProperties = defaultClientProperties(this);

        let loginPacket = {
            entityId: client.id,
            isHardcore: false,
            previousGameMode: 255,
            worldNames: ['minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end'],
            dimensionCodec,
            dimension: {
                type: 'compound',
                name: '',
                value: {
                    bed_works: { type: 'byte', value: 1 },
                    has_ceiling: { type: 'byte', value: 0 },
                    coordinate_scale: { type: 'double', value: 1 },
                    piglin_safe: { type: 'byte', value: 0 },
                    has_skylight: { type: 'byte', value: 1 },
                    ultrawarm: { type: 'byte', value: 0 },
                    infiniburn: { type: 'string', value: 'minecraft:infiniburn_overworld' },
                    effects: { type: 'string', value: 'minecraft:overworld' },
                    has_raids: { type: 'byte', value: 1 },
                    ambient_light: { type: 'float', value: 0 },
                    logical_height: { type: 'int', value: 256 },
                    natural: { type: 'byte', value: 1 },
                    respawn_anchor_works: { type: 'byte', value: 0 }
                }
            },
            worldName: 'minecraft:overworld',
            hashedSeed: [0, 0],
            maxPlayers: 0,
            viewDistance: 1000,
            reducedDebugInfo: false,
            enableRespawnScreen: true,
            isDebug: false,
            isFlat: false
        };

        for (const [key, value] of Object.entries(this.p.defaultProperties)) {
            if (!pubDynProperties[key])
                if (this[key])
                    throw new Error(`"${key}" doesn't allow a default value`)
                else
                    throw new Error(`Unknown default key "${key}" (${typeof value})`)

            let file = pubDynProperties[key];

            if (!file.setDefault)
                throw new Error(`Property "${key}" doesn't allow a default value`)

            let ret = file.setDefault.call(this, value);
            if (file.info?.loginPacket)
                for (const [key, value] of Object.entries(ret))
                    loginPacket[key] = value;
        }

        fs
            .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
            .filter(a => a.endsWith('.js'))
            .map(a => require(`./Client/properties/public/dynamic/${a}`))
            .filter(a => a.info?.loginPacket)
            .forEach(file => {
                for (const [key, value] of Object.entries(file.loginPacket))
                    if (!loginPacket[key])
                        loginPacket[key] = value;
            })

        this.p.sendPacket('login', loginPacket);
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
        else
            return undefined
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