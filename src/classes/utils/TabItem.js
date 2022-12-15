const { applyDefaults } = require('../../functions/applyDefaults');
const { uuid } = require('../../functions/uuid');
const { gamemodes } = require('../../functions/loader/data.js');
const { tabItems } = require('./Client/properties/public/dynamic/tabItems.js');

const settings = require('../../settings.json');
const tabItemDefaults = settings.defaults.tabItem;
const { timing: { skinFetchTimeout } } = require('../../settings.json');

const Text = require('../exports/Text.js');
const axios = require('axios').default;
const path = require('path');

const _p = Symbol('private');
const defaultPrivate = {
    parseProperty: function (key, value) {
        if (key === 'name' && !(value instanceof Text))
            return new Text(value)
        else return value;
    },
    parseProperties: function (properties) {
        for (const [key, value] of Object.entries(properties))
            properties[key] = this.p.parseProperty.call(this, key, value);

        return properties;
    },
    updateProperty: function (name) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (name === 'ping')
            this.p.sendPacket('player_info', {
                action: 2,
                data: [{
                    UUID: this.uuid,
                    ping: this.ping === null ? -1 : this.ping
                }]
            })
        else if (name === 'name')
            //todo: use <Text> onChange event
            this.p.sendPacket('player_info', {
                action: 3,
                data: [{
                    UUID: this.uuid,
                    displayName: JSON.stringify(this.name.chat)
                }]
            })
        else if (name === 'uuid') {
            this.p.textures = null;

            this.p.respawn.call(this);
            if (this.player) {
                //todo: change player uuid and respawn player
            }
        }
    },
    async getTextures() {
        if (this.p.textures)
            return this.p.textures;

        const isValidUuid = (typeof this.p.skinAccountUuid === 'string') && this.p.skinAccountUuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/g);
        let textures;

        if (!isValidUuid)
            textures = { properties: [] }
        else
            textures = await get(`https://sessionserver.mojang.com/session/minecraft/profile/${this.p.skinAccountUuid}?unsigned=false`); //todo: add try catch and emit CustomError

        this.p.textures = textures;
        return textures;
    },
    async spawn(textures) {
        this.p.sendPacket('player_info', {
            action: 0,
            data: [{
                UUID: this.uuid,
                name: this.p.name,
                displayName: JSON.stringify(this.name.chat),
                properties: (textures || await this.p.getTextures.call(this)).properties,
                gamemode: gamemodes.indexOf(this.p.gamemode),
                ping: this.ping === null ? -1 : this.ping
            }]
        });
    },
    remove() {
        this.p.sendPacket('player_info', {
            action: 4,
            data: [{
                UUID: this.uuid
            }]
        });
    },
    async respawn() {
        const textures = await this.p.getTextures.call(this); //load textures before removing tabItem

        this.p.remove.call(this);
        await this.p.spawn.call(this, textures);
        // todo-: implement removing all tabItems (so that order doesn't mess up)
    }
};

const writablePropertyNames = Object.freeze([
    'ping',
    'name',
    'uuid'
]);

class TabItem {
    constructor(p, client, sendPacket, cb) {
        this.client = client;
        this.server = client.server;
        this.p.sendPacket = sendPacket;

        // applyDefaults
        let properties = typeof p === 'object' ? Object.assign({}, p) : p;
        properties = applyDefaults(properties, tabItemDefaults);
        if (properties.uuid === null) { //todo: maybe move to parseProperties
            properties.uuid = uuid().split('');
            properties.uuid[14] = '2'; // set uuid to version 2 so that it can't be a valid client uuid
            properties.uuid = properties.uuid.join('');

            this.p.skinAccountUuid = null;
        } else
            this.p.skinAccountUuid = properties.uuid;
        this.p.gamemode = settings.defaults.gamemode;

        // parseProperties
        properties = this.p.parseProperties.call(this, properties);

        // set private properties
        this.p._ = {};
        for (const propertyName of writablePropertyNames)
            this.p._[propertyName] = properties[propertyName];

        // define getters and setters
        for (const propertyName of writablePropertyNames)
            Object.defineProperty(this, propertyName, {
                configurable: false,
                enumerable: true,
                get: () => this.p._[propertyName],
                set: newValue => {
                    // let oldValue = this.p._[propertyName];
                    this.p._[propertyName] = this.p.parseProperty.call(this, propertyName, newValue);

                    this.p.updateProperty.call(this, propertyName);
                }
            });

        // set name
        if (this.name.string.slice(2).length <= 16)
            this.p.name = this.name.string.slice(2);
        else if (this.name.uncolored.length <= 16)
            this.p.name = this.name.uncolored;
        else
            this.p.name = '';


        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        this
            .p.spawn.call(this)
            .then(() => {
                tabItems.setPrivate.call(this.client, Object.freeze([...this.client.tabItems, this]));
                cb(this);
            });
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
}

async function get(url) {
    const resp = await axios.get(url, { timeout: skinFetchTimeout });
    const data = await resp.data;

    return data;
}

module.exports = TabItem;