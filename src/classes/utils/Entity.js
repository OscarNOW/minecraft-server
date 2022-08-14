const { defaults } = require('../../settings.json')
const { entities, entityAnimations, sounds, soundChannels } = require('../../functions/loader/data.js');

const { uuid } = require('../../functions/uuid.js');
const { EventEmitter } = require('events');

const { CustomError } = require('./CustomError.js')
const { Changable } = require('./Changable.js');

const ps = Object.fromEntries([ // privateSymbols
    '_position',
    'typeId',
    'uuid',
    'sendPacket',
    'observables',
    'emitObservable'
].map(name => [name, Symbol(name)]));

const events = Object.freeze([
    'leftClick',
    'rightClick'
])

const observables = [
    'position'
];

const changePosition = function ({ x = oldValue.x, y = oldValue.y, z = oldValue.z, yaw: ya = oldValue.yaw, pitch = oldValue.pitch }, oldValue) {
    let yaw = ya % 360;

    this[ps.sendPacket]('entity_teleport', {
        entityId: this.id,
        x,
        y,
        z,
        yaw,
        pitch,
        onGround: true
    });

    let changed = false;
    [
        'x',
        'y',
        'z',
        'yaw',
        'pitch'
    ].forEach(val => {
        if (arguments[0][val] !== undefined && oldValue[val] !== arguments[0][val])
            changed = true;
    })

    if (changed)
        this[ps.emitObservable]('position')
}

class Entity extends EventEmitter {
    constructor(client, type, id, { x, y, z, yaw = defaults.entity.position.yaw, pitch = defaults.entity.position.pitch }, sendPacket) {
        super();

        let e = getEntity(type);
        if (e === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'type', ''],
                ['in the ', 'constructor', ' of'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: type,
                expectationType: 'type',
                expectation: 'entityType',
                externalLink: '{docs}/types/entityType.html'
            }, this.constructor).toString()

        this.type = type;
        this.living = e.living;
        this.id = id;
        this.uuid = uuid();
        this.client = client;

        this[ps.typeId] = e.id;
        this[ps.observables] = Object.fromEntries(observables.map(a => [a, []]));
        this[ps.sendPacket] = sendPacket;
        this[ps._position] = new Changable((value, oldValue) => changePosition.call(this, value, oldValue), { x, y, z, yaw, pitch })

        this[ps.emitObservable] = observable =>
            this[ps.observables][observable].forEach(cb => cb(this[observable]))

        if (this.living)
            this[ps.sendPacket]('spawn_entity_living', {
                entityId: this.id,
                entityUUID: this.uuid,
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
                objectUUID: this.uuid,
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

    get position() {
        return this[ps._position];
    }

    set position(newValue) {
        let oldValue = Object.assign({}, this.position.raw)
        this.position.setRaw(newValue)

        changePosition.call(this, newValue, oldValue)
    }

    observe(observable, cb) {
        if (!this[ps.observables][observable])
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'observable', ''],
                ['in the function "', 'observe', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: observable,
                expectationType: 'value',
                expectation: Object.keys(this[ps.observables])
            }, this.observe).toString()

        this[ps.observables][observable].push(cb)
    }

    animation(animationType) {
        if (!this.client.p.canUsed)
            if (this.client.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (entityAnimations[animationType] === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', [
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
        if (!this.client.p.canUsed)
            if (this.client.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        this[ps.sendPacket]('camera', {
            cameraId: this.id
        })
    }

    sound({ sound, channel, volume, pitch }) {
        if (!this.client.p.canUsed)
            if (this.client.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!sounds.find(a => a.name == sound))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'sound', ''],
                ['in the function "', 'sound', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: sound,
                expectationType: 'type',
                expectation: 'soundName',
                externalLink: '{docs}/types/soundName.html'
            }, this.sound).toString()
        if (!soundChannels.includes(channel))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'channel', ''],
                ['in the function "', 'sound', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: channel,
                expectationType: 'value',
                expectation: soundChannels
            }, this.sound).toString()

        this[ps.sendPacket]('entity_sound_effect', {
            soundId: sounds.find(a => a.name == sound).id,
            soundCategory: soundChannels.indexOf(channel),
            entityId: this.id,
            volume,
            pitch
        })
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

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = Entity