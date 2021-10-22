const ChangablePosition = require('./ChangablePosition');
const { v4: uuid } = require('uuid');
const entities = require('../../data/entities.json');

class Entity {
    constructor(client, type, id, { x, y, z, yaw, pitch }) {
        let e = getEntity(type);
        if (e === undefined) throw new Error(`Unknown entity "${type}"`)

        // this.position = { x, y, z, yaw, pitch };
        let that = this;
        this.cachedPosition = new ChangablePosition(i => that.move(i, that), { x, y, z, yaw, pitch })
        this.type = type;
        this.living = e.living;
        this.typeId = e.id;
        this.id = id;
        this.uuid = uuid();
        this.client = client;

        if (this.living)
            this.client.client.write('spawn_entity_living', {
                entityId: this.id, //1
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
                entityId: this.id, //3
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

    move({ x, y, z, yaw: ya, pitch }, thisC) {

        let yaw = ya;
        if (yaw > 127)
            yaw = -127;

        if (yaw < -127)
            yaw = 127;

        (thisC || this).client.client.write('entity_teleport', {
            entityId: this.id,
            x,
            y,
            z,
            yaw,
            pitch,
            onGround: true
        });

        (thisC || this).position.raw = { x, y, z, yaw, pitch }
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}