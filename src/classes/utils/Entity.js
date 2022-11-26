const { defaults } = require('../../settings.json')
const { entities, entityAnimations, sounds, soundChannels } = require('../../functions/loader/data.js');
const { entities: clientEntities } = require('./Client/properties/public/dynamic/entities.js');

const { uuid } = require('../../functions/uuid.js');
const path = require('path');

const CustomError = require('./CustomError.js')
const Changable = require('./Changable.js');

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

const changePosition = function ({ x = oldValue.x, y = oldValue.y, z = oldValue.z, yaw: ya = oldValue.yaw, pitch = oldValue.pitch }, oldValue) {
    const yaw = ya % 360;

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

    //todo: use <Array>.some
    let changed = false;
    for (const val of [
        'x',
        'y',
        'z',
        'yaw',
        'pitch'
    ])
        if (arguments[0][val] !== undefined && oldValue[val] !== arguments[0][val])
            changed = true;

    if (changed)
        this.p.emitObservable.call(this, 'position')
}

class Entity {
    constructor(client, type, id, { x, y, z, yaw = defaults.entity.position.yaw, pitch = defaults.entity.position.pitch }, sendPacket, extraInfo, { sendSpawnPacket = true } = {}) {
        let e = getEntity(type);
        if (e === undefined)
            client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `type in  new ${this.constructor.name}(..., ${require('util').inspect(type)}, ..., ...)  `, {
                got: type,
                expectationType: 'type',
                expectation: 'entityName',
                externalLink: '{docs}/types/entityName'
            }, this.constructor, { server: this.client.server, client: this.client }))

        this.client = client;
        this.sever = client.server;
        this.type = type;
        this.living = e.living;
        this.id = id;
        this.uuid = uuid();

        this.p.typeId = e.id;
        this.p.observables = Object.fromEntries(observables.map(a => [a, []]));
        this.p.sendPacket = sendPacket;
        this.p._position = new Changable((value, oldValue) => changePosition.call(this, value, oldValue), { x, y, z, yaw, pitch })
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

        if (callPath.startsWith(folderPath)) {
            if (!this[_p])
                this[_p] = Object.assign({}, defaultPrivate);

            return this[_p];
        } else
            return this.p._p
    }

    set p(value) {
        this.p._p = value;
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
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `observable in  <${this.constructor.name}>.observe(${require('util').inspect(observable)}, ...)  `, {
                got: observable,
                expectationType: 'value',
                expectation: Object.keys(this.p.observables)
            }, this.observe, { server: this.client.server, client: this.client }))

        this.p.observables[observable].push(cb)
    }

    animation(animationType) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (entityAnimations[animationType] === undefined)
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `animationType in  <${this.constructor.name}>.animation(${require('util').inspect(animationType)})  `, {
                got: animationType,
                expectationType: 'value',
                expectation: Object.keys(entityAnimations)
            }, this.rawListeners, { server: this.client.server, client: this.client }))

        this.p.sendPacket('animation', {
            entityId: this.id,
            animation: entityAnimations[animationType]
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
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `sound in  <${this.constructor.name}>.sound({ sound: ${require('util').inspect(sound)} })  `, {
                got: sound,
                expectationType: 'type',
                expectation: 'soundName',
                externalLink: '{docs}/types/soundName'
            }, this.sound, { server: this.client.server, client: this.client }))
        if (!soundChannels.includes(channel))
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.sound({ channel: ${require('util').inspect(channel)} })  `, {
                got: channel,
                expectationType: 'value',
                expectation: soundChannels
            }, this.sound, { server: this.client.server, client: this.client }))

        this.p.sendPacket('entity_sound_effect', {
            soundId: sounds.find(a => a.name === sound).id,
            soundCategory: soundChannels.indexOf(channel),
            entityId: this.id,
            volume,
            pitch
        })
    }

    remove() {
        this.p.sendPacket('entity_destroy', {
            entityIds: [this.id]
        });

        let newClientEntities = Object.assign({}, this.client.entities);
        delete newClientEntities[this.id];

        clientEntities.setPrivate.call(this.client, Object.freeze(newClientEntities));
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
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on, { server: this.client.server, client: this.client }))

        this.p.events[event].push({ callback, once: false });
    }

    once(event, callback) {
        if (!events.includes(event))
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.once(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on, { server: this.client.server, client: this.client }))

        this.p.events[event].push({ callback, once: true });
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = Entity