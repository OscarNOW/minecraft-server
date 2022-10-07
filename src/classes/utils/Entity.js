const { defaults } = require('../../settings.json')
const { entities, entityAnimations, sounds, soundChannels } = require('../../functions/loader/data.js');

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
    emitObservable(observable) {
        this.p.observables[observable].forEach(cb => cb(this[observable]))
    }
};

const changePosition = function ({ x = oldValue.x, y = oldValue.y, z = oldValue.z, yaw: ya = oldValue.yaw, pitch = oldValue.pitch }, oldValue) {
    let yaw = ya % 360;

    this.p.sendPacket('entity_teleport', {
        entityId: this.id,
        x,
        y,
        z,
        yaw,
        pitch,
        onGround: true
    });

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
        this.p.emitObservable('position')
}

class Entity {
    constructor(client, type, id, { x, y, z, yaw = defaults.entity.position.yaw, pitch = defaults.entity.position.pitch }, sendPacket) {
        let e = getEntity(type);
        if (e === undefined)
            client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `type in  new ${this.constructor.name}(..., ${require('util').inspect(type)}, ..., ...)  `, {
                got: type,
                expectationType: 'type',
                expectation: 'entityType',
                externalLink: '{docs}/types/entityType.html'
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
                headPitch: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
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
                objectData: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
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
        this.client.p.stateHandler.checkReady.call(this.client);

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
        this.client.p.stateHandler.checkReady.call(this.client);

        this.p.sendPacket('camera', {
            cameraId: this.id
        })
    }

    sound({ sound, channel, volume, pitch }) {
        this.client.p.stateHandler.checkReady.call(this.client);

        if (!sounds.find(a => a.name == sound))
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `sound in  <${this.constructor.name}>.sound({ sound: ${require('util').inspect(sound)} })  `, {
                got: sound,
                expectationType: 'type',
                expectation: 'soundName',
                externalLink: '{docs}/types/soundName.html'
            }, this.sound, { server: this.client.server, client: this.client }))
        if (!soundChannels.includes(channel))
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.sound({ channel: ${require('util').inspect(channel)} })  `, {
                got: channel,
                expectationType: 'value',
                expectation: soundChannels
            }, this.sound, { server: this.client.server, client: this.client }))

        this.p.sendPacket('entity_sound_effect', {
            soundId: sounds.find(a => a.name == sound).id,
            soundCategory: soundChannels.indexOf(channel),
            entityId: this.id,
            volume,
            pitch
        })
    }

    remove() {
        throw new Error('Not implemented')

        // this.client.p.stateHandler.checkReady.call(this.client);

        // this.p.sendPacket('destroy_entities', {
        //     entityIds: [this.id]
        // })

        // delete this.client.entities[this.id]        
    }

    on(event, callback) {
        if (!events.includes(event))
            this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on, { server: this.client.server, client: this.client }))

        this.p.events[event].push(callback)
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = Entity