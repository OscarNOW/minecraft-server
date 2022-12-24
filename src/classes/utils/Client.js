const fs = require('fs');
const path = require('path');

const _p = Symbol('_privates');

class Client {
    constructor(client, server, { version, connection: { host, port }, ip }, defaultClientProperties = () => ({})) {
        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        })

        this.p.client = client;
        this.p.defaultClientProperties = defaultClientProperties;
        this.server = server;
        this.version = version;
        this.ip = ip;
        this.connection = {
            host,
            port
        };

        //Inject private static properties
        for (const [key, value] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/properties/private/static/'))
                .filter(v => v.endsWith('.js'))
                .filter(v => !v.endsWith('.test.js'))
                .map(v => require(`./Client/properties/private/static/${v}`))
            )
        ))
            this.p[key] = value.call(this)

        //Inject private methods
        for (const [key, value] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/methods/private/'))
                .filter(v => v.endsWith('.js'))
                .filter(v => !v.endsWith('.test.js'))
                .map(v => require(`./Client/methods/private/${v}`))
            )
        ))
            this.p[key] = value.bind(this)

        //Inject public methods
        let cachedMethods = {};

        Object.defineProperties(this,
            Object.fromEntries(
                fs
                    .readdirSync(path.resolve(__dirname, './Client/methods/public/'))
                    .filter(v => v.endsWith('.js'))
                    .filter(v => !v.endsWith('.test.js'))
                    .map(v => [v.split('.')[0], path.resolve(__dirname, './Client/methods/public/', v)])
                    .map(([name, path]) => [name, {
                        configurable: false,
                        enumerable: true,
                        get: () => {
                            if (cachedMethods[name])
                                return cachedMethods[name]

                            cachedMethods[name] = require(path).bind(this);
                            return cachedMethods[name];
                        }
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
                        .filter(v => !v.endsWith('.test.js'))
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
                .filter(v => !v.endsWith('.test.js'))
                .map(v => require(`./Client/properties/public/dynamic/${v}`))
            )
        ))
            init?.call?.(this);

        //Inject public dynamic properties
        let pubDynProperties = Object.assign({}, ...fs
            .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
            .filter(v => v.endsWith('.js'))
            .filter(v => !v.endsWith('.test.js'))
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

        this.p.pubDynProperties = pubDynProperties;

        //Inject events
        for (const [eventName, eventCallback] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/events/'))
                .filter(a => a.endsWith('.js'))
                .filter(v => !v.endsWith('.test.js'))
                .map(a => require(`./Client/events/${a}`))
            )
        ))
            //using custom proxy, no difference in speed
            this.p.clientOn(eventName, (...args) => setTimeout(() => eventCallback.call(this, ...args), 0));

        //Start receiving packets
        this.p.client.on('packet', (packet, { name }) => this.p.receivePacket(name, packet));

        //Run constructors
        for (const { func } of fs
            .readdirSync(path.resolve(__dirname, './Client/constructors/'))
            .filter(a => a.endsWith('.js'))
            .filter(v => !v.endsWith('.test.js'))
            .map(a => ({ name: a.split('.js')[0], ...require(`./Client/constructors/${a}`) }))
            .sort(({ index: a }, { index: b }) => a - b)
        )
            func?.call?.(this)

        //Initialize stateHandler
        this.p.stateHandler.init.call(this);

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
            return this.p._p
    }

    set p(value) {
        this.p._p = value;
    }
}

module.exports = Client