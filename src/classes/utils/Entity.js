const ChangablePosition = require('./ChangablePosition').ChangablePosition;
const { v4: uuid } = require('uuid');
const entities = require('../../data/entities.json');
const entityAnimations = require('../../data/entityAnimations.json');

class Entity {
    constructor(client, type, id, { x, y, z, yaw, pitch }) {
        const that = this;

        let e = getEntity(type);
        if (e === undefined) throw new Error(`Unknown entity "${type}"`)

        this.cachedPosition = new ChangablePosition(i => that.move.call(that, i), { x, y, z, yaw, pitch })
        this.type = type;
        this.living = e.living;
        this.typeId = e.id;
        this.id = id;
        this.uuid = uuid();
        this.client = client;

        this.events = {
            leftClick: [],
            rightClick: []
        }

        if (this.living)
            this.client.client.write('spawn_entity_living', {
                entityId: this.id,
                entityUUID: this.uuid,
                type: this.typeId,
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
            this.client.client.write('spawn_entity', {
                entityId: this.id,
                objectUUID: this.uuid,
                type: this.typeId,
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
        return this.cachedPosition;
    }

    set position(v) {
        this.move(v)
    }

    move({ x, y, z, yaw: ya, pitch }) {

        let yaw = ya;
        if (yaw > 127)
            yaw = -127;

        if (yaw < -127)
            yaw = 127;

        this.client.client.write('entity_teleport', {
            entityId: this.id,
            x,
            y,
            z,
            yaw,
            pitch,
            onGround: true
        });

        this.position.raw = { x, y, z, yaw, pitch }
    }

    animation(animationType) {
        if (entityAnimations[animationType] === undefined) throw new Error(`Unknown animationType "${animationType}"`)

        this.client.client.write('animation', {
            entityId: this.id,
            animation: entityAnimations[animationType]
        })
    }

    camera() {
        this.client.client.write('camera', {
            cameraId: this.id
        })
    }

    on(event, callback) {
        if (!this.events[event]) throw new Error(`Unknown event "${event}"`)
        this.events[event].push(callback);
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = { Entity };