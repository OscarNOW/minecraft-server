const { defaults } = require('../../settings.json');
const { bossBarColors, bossBarDivisions } = require('../../functions/loader/data.js');

const path = require('path');

const { uuid } = require('../../functions/uuid.js');
const { applyDefaults } = require('../../functions/applyDefaults.js');
const Changeable = require('./Changeable.js');
const Text = require('../exports/Text.js');
const { bossBars } = require('./Client/properties/public/dynamic/bossBars.js');

const _p = Symbol('private');
const defaultPrivate = {
    updateFlags(newFlags, oldFlags) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (!this.p.visible)
            return;

        let darkenSkyChanged = oldFlags.darkenSky !== newFlags.darkenSky;
        let playEndMusicChanged = oldFlags.playEndMusic !== newFlags.playEndMusic;
        let createFogChanged = oldFlags.createFog !== newFlags.createFog;

        if (darkenSkyChanged || playEndMusicChanged || createFogChanged)
            this.p.sendPacket('boss_bar', {
                entityUUID: this.id,
                action: 5,
                flags: parseInt([newFlags.createFog, newFlags.playEndMusic, newFlags.darkenSky].map(a => a ? '1' : '0').join(''), 2)
            })
    },
    updateProperty(name) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (!this.p.visible)
            return;

        if (name === 'health')
            this.p.sendPacket('boss_bar', {
                entityUUID: this.id,
                action: 2,
                health: this.health
            });
        else if (name === 'title')
            this.p.sendPacket('boss_bar', {
                entityUUID: this.id,
                action: 3,
                title: JSON.stringify(this.title.chat)
            });
        else if (name === 'color' || name === 'divisionAmount')
            this.p.sendPacket('boss_bar', {
                entityUUID: this.id,
                action: 4,
                color: bossBarColors.indexOf(this.color),
                dividers: bossBarDivisions.indexOf(this.divisionAmount)
            });
    },
    parseProperty(key, value) {
        if (key === 'title')
            if (!(value instanceof Text))
                return new Text(value);
            else
                return value;
        else if (key === 'flags')
            return new Changeable(this.p.updateFlags, {
                darkenSky: value.darkenSky,
                playEndMusic: value.playEndMusic,
                createFog: value.createFog
            });
        else return value;
    },
    parseProperties(properties) {
        for (const [key, value] of Object.entries(properties))
            properties[key] = this.p.parseProperty.call(this, key, value);

        return properties;
    }
};

const propertyNames = Object.freeze([
    'title',
    'health',
    'color',
    'divisionAmount'
])

class BossBar {
    constructor(client, sendPacket, p) {

        this.client = client;
        this.server = client.server;
        this.p.sendPacket = sendPacket;

        //initialization
        const bossBarUuid = uuid();
        this.p.visible = true;

        // parseProperties
        let properties = typeof p === 'object' ? Object.assign({}, p) : p;
        properties = applyDefaults(properties, defaults.bossBar);
        properties = this.p.parseProperties.call(this, properties);

        //set private properties
        this.p._ = {};
        for (const propertyName of propertyNames)
            this.p._[propertyName] = properties[propertyName];

        this.p._.flags = properties.flags;

        //define getters and setters
        for (const propertyName of propertyNames)
            Object.defineProperty(this, propertyName, {
                configurable: false,
                enumerable: true,
                get: () => this.p._[propertyName],
                set: newValue => {
                    // let oldValue = this.p._[propertyName];
                    this.p._[propertyName] = newValue; //todo: call parseProperty here

                    this.p.updateProperty.call(this, propertyName);
                }
            })
        Object.defineProperty(this, 'id', {
            configurable: false,
            enumerable: true,
            writable: false,
            value: bossBarUuid
        })

        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        this.p.sendPacket('boss_bar', {
            entityUUID: this.id,
            action: 0,
            title: JSON.stringify(this.title.chat),
            health: this.health,
            color: bossBarColors.indexOf(this.color),
            dividers: bossBarDivisions.indexOf(this.divisionAmount),
            flags: parseInt([this.flags.createFog, this.flags.playEndMusic, this.flags.darkenSky].map(a => a ? '1' : '0').join(''), 2)
        })

        bossBars.set.call(this.client, Object.freeze([...this.client.bossBars, this]));
    }

    get flags() {
        return this.p._.flags;
    }

    set flags(value) {
        let oldValue = this.p._.flags.raw;
        this.p._.flags.setRaw(value);

        this.p.updateFlags.call(this, value, oldValue);
    }

    remove() {
        this.p.sendPacket('boss_bar', {
            entityUUID: this.id,
            action: 1
        })

        this.p.visible = false;
        bossBars.set.call(this, Object.freeze(this.bossBars.filter(a => a.id !== this.id)));
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
}

module.exports = BossBar;