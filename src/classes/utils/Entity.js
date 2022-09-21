const { defaults } = require('../../settings.json')
const { entities, entityAnimations, sounds, soundChannels } = require('../../functions/loader/data.js');

const { uuid } = require('../../functions/uuid.js');

const CustomError = require('./CustomError.js')
const Changable = require('./Changable.js');

const ps = Object.fromEntries([ // privateSymbols
    '_position',
    'typeId',
    'uuid',
    'sendPacket',
    'observables',
    'emitObservable',
    'events'
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
        this[ps.emitObservable]('position')
}

class Entity {
    constructor(client, type, id, { x, y, z, yaw = defaults.entity.position.yaw, pitch = defaults.entity.position.pitch }, sendPacket) {
        let e = getEntity(type);
        if (e === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', `type in  new ${this.constructor.name}(..., ${require('util').inspect(type)}, ..., ...)  `, {
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
        this[ps.events] = Object.fromEntries(events.map(a => [a, []]));
        this.privateEmitter = {
            emit: (event, ...args) => {
                for (const listener of this[ps.events][event]) listener(...args)
            }
        }

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
            throw new CustomError('expectationNotMet', 'libraryUser', `observable in  <${this.constructor.name}>.observe(${require('util').inspect(observable)}, ...)  `, {
                got: observable,
                expectationType: 'value',
                expectation: Object.keys(this[ps.observables])
            }, this.observe).toString()

        this[ps.observables][observable].push(cb)
    }

    animation(animationType) {
        this.client.p.stateHandler.checkReady.call(this.client);

        if (entityAnimations[animationType] === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', `animationType in  <${this.constructor.name}>.animation(${require('util').inspect(animationType)})  `, {
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
        this.client.p.stateHandler.checkReady.call(this.client);

        this[ps.sendPacket]('camera', {
            cameraId: this.id
        })
    }

    sound({ sound, channel, volume, pitch }) {
        this.client.p.stateHandler.checkReady.call(this.client);

        if (!sounds.find(a => a.name == sound))
            throw new CustomError('expectationNotMet', 'libraryUser', `sound in  <${this.constructor.name}>.sound({ sound: ${require('util').inspect(sound)} })  `, {
                got: sound,
                expectationType: 'type',
                expectation: 'soundName',
                externalLink: '{docs}/types/soundName.html'
            }, this.sound).toString()
        if (!soundChannels.includes(channel))
            throw new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.sound({ channel: ${require('util').inspect(channel)} })  `, {
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

    remove() {
        throw new Error('not implemented')

        // this.client.p.stateHandler.checkReady.call(this.client);

        // this[ps.sendPacket]('destroy_entities', {
        //     entityIds: [this.id]
        // })

        // delete this.client.entities[this.id]        
    }

    on(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on).toString()

        this[ps.events][event].push(callback)
    }
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = Entity