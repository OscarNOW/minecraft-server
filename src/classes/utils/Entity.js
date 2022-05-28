const { ChangablePosition } = require('./ChangablePosition');

const entities = require('../../data/entities.json');
const entityAnimations = require('../../data/entityAnimations.json');

const { v4: uuid } = require('uuid');
const { EventEmitter } = require('events');

const ps = Object.fromEntries([ // privateSymbols
    '_position',
    'typeId',
    'uuid',
    'sendPacket'
].map(name => [name, Symbol(name)]));

class Entity extends EventEmitter {
    constructor(client, type, id, { x, y, z, yaw, pitch }, sendPacket) {
        super();

        const that = this;

        let e = getEntity(type);
        if (e === undefined) throw new Error(`Unknown entity "${type}"`)

        this[ps._position] = new ChangablePosition(i => that.move.call(that, i), { x, y, z, yaw, pitch })
        this.type = type;
        this.living = e.living;
        this[ps.typeId] = e.id;
        this.id = id;
        this[ps.uuid] = uuid();
        this.client = client;

        this[ps.sendPacket] = sendPacket;

        this.events = [
            'leftClick',
            'rightClick'
        ]

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
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.on(event, callback);
    }

    once(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event != undefined && !this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!this.events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
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

        this.position._ = { x, y, z, yaw, pitch }
    }

    animation(animationType) {
        if (entityAnimations[animationType] === undefined) throw new Error(`Unknown animationType "${animationType}"`)

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