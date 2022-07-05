const { entities, entityAnimations } = require('../../functions/loader/data.js');

const { v4: uuid } = require('uuid');
const { EventEmitter } = require('events');

const { CustomError } = require('./CustomError.js')
const { Changable } = require('./Changable.js');

const ps = Object.fromEntries([ // privateSymbols
    '_position',
    'typeId',
    'uuid',
    'sendPacket'
].map(name => [name, Symbol(name)]));

const events = Object.freeze([
    'leftClick',
    'rightClick'
])

class Entity extends EventEmitter {
    constructor(client, type, id, { x, y, z, yaw, pitch }, sendPacket) {
        super();

        const that = this;

        let e = getEntity(type);
        if (e === undefined)
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'type', ''],
                    ['in the ', 'constructor', ' of'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: type,
                    expectationType: 'type',
                    expectation: 'entityType',
                    externalLink: '{docs}/types/entityType.html'
                }, this.constructor).toString()

        this[ps._position] = new Changable(i => that.position = i, { x, y, z, yaw, pitch })
        this.type = type;
        this.living = e.living;
        this[ps.typeId] = e.id;
        this.id = id;
        this[ps.uuid] = uuid();
        this.client = client;

        this[ps.sendPacket] = sendPacket;

        if (this.living)
            this[ps.sendPacket]('spawn_entity_living', {
                entityId: this.id,
                entityUUID: this[ps.uuid],
                type: this[ps.typeId],
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                yaw: this.position.yaw,
                pitch: this.position.pitch,
                headPitch: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
        else
            this[ps.sendPacket]('spawn_entity', {
                entityId: this.id,
                objectUUID: this[ps.uuid],
                type: this[ps.typeId],
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                pitch: this.position.pitch,
                yaw: this.position.yaw,
                objectData: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
    }

    addListener(event, callback) {
        if (!events.includes(event))
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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
            /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
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

    get position() {
        return this[ps._position];
    }

    set position({ x, y, z, yaw: ya, pitch }) {
        let yaw = ya;
        if (yaw > 127)
            yaw = -127;

        if (yaw < -127)
            yaw = 127;

        this[ps.sendPacket]('entity_teleport', {
            entityId: this.id,
            x,
            y,
            z,
            yaw,
            pitch,
            onGround: true
        });

        this.position.setRaw({ x, y, z, yaw, pitch })
    }

    animation(animationType) {
        if (entityAnimations[animationType] === undefined)
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'animationType', ''],
                    ['in the function "', 'animation', '"'],
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: animationType,
                    expectationType: 'value',
                    expectation: Object.keys(entityAnimations)
                }, this.rawListeners).toString()

        this[ps.sendPacket]('animation', {
            entityId: this.id,
            animation: entityAnimations[animationType]
        })
    }

    camera() {
        this[ps.sendPacket]('camera', {
            cameraId: this.id
        })
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = Object.freeze({ Entity });