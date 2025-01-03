const { defaults } = require('../../settings.json')
const { entities, entityAnimations, sounds, soundChannels } = require('../../functions/loader/data.js');
const { applyDefaults } = require('../../functions/applyDefaults.js');
const { entities: clientEntities } = require('./Client/properties/public/dynamic/entities.js');

const { uuid } = require('../../functions/uuid.js');
const path = require('path');

const Changeable = require('./Changeable.js');
const Text = require('../exports/Text.js');

const _p = Symbol('private');

const events = Object.freeze([
    'leftClick',
    'rightClick'
])

const observables = [
    'position'
];

const defaultPrivate = {
    emitObservable(type) {
        this.p.observables[type].forEach(cb => cb(this[type]))
    },

    emit(event, ...args) {
        if (this.p.events[event])
            this.p.events[event].forEach(({ callback }) => callback(...args));

        this.p.events[event] = this.p.events[event].filter(({ once }) => once === false);
    }
};

const changePosition = function (pos, oldValue) {
    const { x, y, z, yaw: ya, pitch: pit } = applyDefaults(pos, oldValue);

    let yaw = ya % 256;
    if (yaw > 127) yaw -= 256;

    let pitch = pit % 256;
    if (pitch > 127) pitch -= 256;

    const xChange = Math.abs(x - oldValue.x);
    const yChange = Math.abs(y - oldValue.y);
    const zChange = Math.abs(z - oldValue.z);

    let usingSmallChangePacket = true;

    if (xChange >= 8) usingSmallChangePacket = false;
    if (yChange >= 8) usingSmallChangePacket = false;
    if (zChange >= 8) usingSmallChangePacket = false;

    if (usingSmallChangePacket) {
        const locationChanged = x !== oldValue.x || y !== oldValue.y || z !== oldValue.z;
        const rotationChanged = yaw !== oldValue.yaw || pitch !== oldValue.pitch;

        const dX = ((x * 32) - (oldValue.x * 32)) * 128;
        const dY = ((y * 32) - (oldValue.y * 32)) * 128;
        const dZ = ((z * 32) - (oldValue.z * 32)) * 128;

        if (locationChanged && rotationChanged)
            this.p.sendPacket('entity_move_look', {
                entityId: this.id,
                dX,
                dY,
                dZ,
                yaw,
                pitch,
                onGround: true //todo
            })
        else if (locationChanged)
            this.p.sendPacket('rel_entity_move', {
                entityId: this.id,
                dX,
                dY,
                dZ,
                onGround: true //todo
            })
        else if (rotationChanged)
            this.p.sendPacket('entity_look', {
                entityId: this.id,
                yaw,
                pitch,
                onGround: true //todo
            })

    } else
        this.p.sendPacket('entity_teleport', {
            entityId: this.id,
            x,
            y,
            z,
            yaw,
            pitch,
            onGround: true //todo
        });

    let changed = [
        'x',
        'y',
        'z',
        'yaw',
        'pitch'
    ].some(val => arguments[0][val] !== undefined && oldValue[val] !== arguments[0][val])

    if (changed)
        this.p.emitObservable.call(this, 'position')
}

class Entity {
    constructor(
        client,
        type,
        id,
        {
            x,
            y,
            z,
            yaw = defaults.entity.position.yaw,
            pitch = defaults.entity.position.pitch
        },
        sendPacket,
        extraInfo,
        {
            sendSpawnPacket = true,
            beforeRemove = []
        } = {}
    ) {

        this.client = client;
        this.sever = client.server;
        this.p.beforeRemove = beforeRemove;

        let [typeId, e] = getEntity(type);
        if (!e)
            throw new Error(`Unknown entity type "${type}"`);

        this.type = type;
        this.living = e.living;
        this.id = id;
        this.uuid = uuid();

        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        this.p.typeId = typeId;
        this.p.observables = Object.fromEntries(observables.map(a => [a, []]));
        this.p.sendPacket = sendPacket;
        this.p._position = new Changeable((value, oldValue) => changePosition.call(this, value, oldValue), { x, y, z, yaw, pitch }) //todo: add changePosition to private
        this.p.events = Object.fromEntries(events.map(a => [a, []]));

        if (sendSpawnPacket !== false)
            if (this.living)
                this.p.sendPacket('spawn_entity_living', {
                    entityId: this.id,
                    entityUUID: this.uuid,
                    type: this.p.typeId,
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z,
                    yaw: this.position.yaw,
                    pitch: this.position.pitch,
                    headPitch: 0, //todo
                    velocityX: 0, //todo
                    velocityY: 0, //todo
                    velocityZ: 0 //todo
                })
            else
                this.p.sendPacket('spawn_entity', {
                    entityId: this.id,
                    objectUUID: this.uuid,
                    type: this.p.typeId,
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z,
                    pitch: this.position.pitch,
                    yaw: this.position.yaw,
                    objectData: 0, //todo
                    velocityX: 0, //todo
                    velocityY: 0, //todo
                    velocityZ: 0 //todo
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

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected access to private properties from outside of the module. This is not recommended and may cause unexpected behavior.');

        if (!this[_p]) //todo: create private when instantiating class
            this[_p] = Object.assign({}, defaultPrivate);

        return this[_p];
    }

    set p(value) {
        console.error('(minecraft-server) ERROR: Setting private properties is not supported. Action ignored.');
    }

    get position() {
        return this.p._position;
    }

    set position(newValue) {
        let oldValue = Object.assign({}, this.position.raw)
        this.position.setRaw(newValue)

        changePosition.call(this, newValue, oldValue)
    }

    observe(observable, cb) {
        if (!this.p.observables[observable])
            throw new Error(`Unknown observable "${observable}"`);

        this.p.observables[observable].push(cb)
    }

    animation(animationType) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (!entityAnimations.includes(animationType))
            throw new Error(`Unknown animation type "${animationType}"`);

        this.p.sendPacket('animation', {
            entityId: this.id,
            animation: entityAnimations.indexOf(animationType)
        })
    }

    camera() {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        this.p.sendPacket('camera', {
            cameraId: this.id
        })
    }

    sound({ sound, channel, volume, pitch }) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (!sounds.find(a => a.name === sound))
            throw new Error(`Unknown sound "${sound}"`);

        if (!soundChannels.includes(channel))
            throw new Error(`Unknown sound channel "${channel}"`);

        this.p.sendPacket('entity_sound_effect', {
            soundId: sounds.find(a => a.name === sound).id,
            soundCategory: soundChannels.indexOf(channel),
            entityId: this.id,
            volume,
            pitch
        });
    }

    remove() {
        for (const func of this.p.beforeRemove)
            func();

        //todo: check if Client is ready?

        this.p.sendPacket('entity_destroy', {
            entityIds: [this.id]
        });

        let newClientEntities = Object.assign({}, this.client.entities);
        delete newClientEntities[this.id];

        clientEntities.set.call(this.client, Object.freeze(newClientEntities));
    }

    killClient(deathMessage = '') {

        //todo: check if Client is ready?

        if (!(deathMessage instanceof Text))
            deathMessage = new Text(deathMessage);

        this.p.sendPacket('combat_event', {
            event: 2,
            playerId: this.client.entityId,
            entityId: this.id, //killer
            message: JSON.stringify(deathMessage.chat)
        });
    }

    removeAllListeners(event) {
        if (event)
            this.p.events[event] = [];
        else
            for (const event of Object.keys(this.p.events))
                this.p.events[event] = [];
    }

    on(event, callback) {
        if (!events.includes(event))
            throw new Error(`Unknown event "${event}"`);

        this.p.events[event].push({ callback, once: false });
    }

    once(event, callback) {
        if (!events.includes(event))
            throw new Error(`Unknown event "${event}"`);

        this.p.events[event].push({ callback, once: true });
    }
}

function getEntity(searchName) {
    const index = entities.findIndex(({ name }) => name === searchName);
    if (index === -1)
        return [null, null];

    return [index, entities[index]];
}

module.exports = Entity