const { applyDefaults } = require('../../functions/applyDefaults');
const { gamemodes } = require('../../functions/loader/data.js');
const { tabItems } = require('./Client/properties/public/dynamic/tabItems.js');

const defaults = require('../../settings.json').defaults.tabItem;
const { timing: { skinFetchTimeout } } = require('../../settings.json');

const Text = require('../exports/Text.js');
const axios = require('axios').default;
const path = require('path');

const _p = Symbol('private');
const defaultPrivate = {
    parseProperty: function (key, value) {
        if (key === 'displayName' && value !== null && !(value instanceof Text))
            return new Text(value);
        else if (key === 'skinAccountUuid')
            return value; //todo-imp: check if skinAccountUuid is valid uuid to avoid uri injection
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

        if (name === 'gamemode')
            this.p.sendPacket('player_info', {
                action: 1,
                data: [{
                    UUID: this.uuid,
                    gamemode: gamemodes.indexOf(this.gamemode)
                }]
            })
        else if (name === 'ping')
            this.p.sendPacket('player_info', {
                action: 2,
                data: [{
                    UUID: this.uuid,
                    ping: this.ping
                }]
            })
        else if (name === 'displayName') //todo: use <Text> onChange event
            this.p.sendPacket('player_info', {
                action: 3,
                data: [{
                    UUID: this.uuid,
                    displayName: JSON.stringify(this.displayName.chat)
                }]
            })
    }
};

const writablePropertyNames = Object.freeze([
    'gamemode',
    'ping',
    'displayName'
]);

const readonlyPropertyNames = Object.freeze([
    'name',
    'uuid',
    'skinAccountUuid'
]);

class TabItem {
    constructor(p, client, sendPacket, cb) {
        this.client = client;
        this.server = client.server;
        this.p.sendPacket = sendPacket;

        // parseProperties
        let properties = typeof p === 'object' ? Object.assign({}, p) : p;
        properties = applyDefaults(properties, defaults);
        properties = this.p.parseProperties.call(this, properties);

        // set private properties
        this.p._ = {};
        for (const propertyName of writablePropertyNames)
            this.p._[propertyName] = properties[propertyName];
        for (const propertyName of readonlyPropertyNames)
            this.p._[propertyName] = properties[propertyName];

        // define getters and setters
        for (const propertyName of writablePropertyNames)
            Object.defineProperty(this, propertyName, {
                configurable: false,
                enumerable: true,
                get: () => this.p._[propertyName],
                set: newValue => {
                    // let oldValue = this.p._[propertyName];
                    this.p._[propertyName] = this.p.parseProperty(propertyName, newValue);

                    this.p.updateProperty.call(this, propertyName);
                }
            });
        for (const propertyName of readonlyPropertyNames)
            Object.defineProperty(this, propertyName, {
                configurable: false,
                enumerable: true,
                get: () => this.p._[propertyName]
            });


        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        this
            .sendStartPacket()
            .then(() => {
                tabItems.setPrivate.call(this.client, Object.freeze([...this.client.tabItems, this]));
                cb(this);
            });
    }
    async getSkin() { //todo: make method private
        if (!this.skinAccountUuid)
            return { properties: [] } //todo: maybe set default to uuid, because empty array causes Client to load skin from uuid
        else
            return await get(`https://sessionserver.mojang.com/session/minecraft/profile/${this.skinAccountUuid}?unsigned=false`); //todo: add try catch and emit CustomError
    }
    async sendStartPacket() {
        const { properties } = await this.getSkin();

        let packet = {
            action: 0,
            data: [{
                UUID: this.uuid,
                name: this.name,
                properties,
                gamemode: gamemodes.indexOf(this.gamemode),
                ping: this.ping === null ? -1 : this.ping
            }]
        };

        if (this.displayName !== null)
            packet.data[0].displayName = JSON.stringify(this.displayName.chat);

        this.p.sendPacket('player_info', packet);
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