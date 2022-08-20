const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

const CustomError = require('./CustomError.js');

const _p = Symbol('_privates');
const events = Object.freeze([
    'chat',
    'digStart',
    'digCancel',
    'blockBreak',
    'itemDrop',
    'itemHandSwap',
    'leftClick',
    'rightClick',
    'connect',
    'join',
    'leave'
]);

class Client extends EventEmitter {
    constructor(client, server, { version, connection: { host, port }, ip }, defaultClientProperties = () => ({})) {
        super();

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
        }

        //Inject private static properties
        for (const [key, value] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/properties/private/static/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/properties/private/static/${v}`))
            )
        ))
            this.p[key] = value.call(this)

        //Inject private methods
        for (const [key, value] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/methods/private/'))
                .filter(v => v.endsWith('.js'))
                .map(v => require(`./Client/methods/private/${v}`))
            )
        ))
            this.p[key] = value.bind(this)

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

        this.p.pubDynProperties = pubDynProperties;

        //Initialize stateHandler
        this.p.stateHandler.init.call(this);

        //Inject events
        for (const [eventName, eventCallback] of Object.entries(
            Object.assign({}, ...fs
                .readdirSync(path.resolve(__dirname, './Client/events/'))
                .filter(a => a.endsWith('.js'))
                .map(a => require(`./Client/events/${a}`))
            )
        ))
            this.p.client.on(eventName, eventCallback.bind(this))

        //Keep alive packets
        let clientKeepAliveKick = 30000;
        let sendKeepAliveInterval = 4000;

        let keepAlivePromises = {};
        this.p.setInterval(() => {
            let currentId = Math.floor(Math.random() * 1000000);
            while (keepAlivePromises[currentId])
                currentId = Math.floor(Math.random() * 1000000);

            new Promise((res, rej) => {
                keepAlivePromises[currentId] = { res, rej, resolved: false };

                this.p.setTimeout(() => {
                    if (this.online && !keepAlivePromises[currentId].resolved)
                        rej(new Error(`Client didn't respond to keep alive packet in time`));

                    delete keepAlivePromises[currentId];
                }, clientKeepAliveKick)
            })

            this.p.sendPacket('keep_alive', {
                keepAliveId: BigInt(currentId)
            })
        }, sendKeepAliveInterval)

        this.p.client.on('keep_alive', ({ keepAliveId }) => {
            keepAlivePromises[keepAliveId[1]].resolved = true;
            keepAlivePromises[keepAliveId[1]].res();
        })

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

    addListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'addListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.addListener).toString()

        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'on', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on).toString()

        return super.on(event, callback);
    }

    once(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'once', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.once).toString()

        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'prependListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.prependListener).toString()

        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'prependOnceListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.prependOnceListener).toString()

        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'off', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.off).toString()

        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'removeListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.removeListener).toString()

        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event !== undefined && !events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'removeAllListeners', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.removeAllListeners).toString()

        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'rawListeners', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.rawListeners).toString()

        return super.rawListeners(event);
    }
}

module.exports = Client