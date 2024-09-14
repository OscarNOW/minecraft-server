const { applyDefaults } = require('../../functions/applyDefaults');
const { uuid } = require('../../functions/uuid');
const { getSkinTextures } = require('../../functions/getSkinTextures');
const { gamemodes } = require('../../functions/loader/data.js');
const { tabItems } = require('./Client/properties/public/dynamic/tabItems.js');

const settings = require('../../settings.json');
const tabItemDefaults = settings.defaults.tabItem;
const skinFetchTimeout = settings.timing.skinFetchTimeout;

const Text = require('../exports/Text.js');
const path = require('path');

const _p = Symbol('private');
const defaultPrivate = {
    parseProperty(key, value) {
        if (key === 'name' && !(value instanceof Text))
            return new Text(value)
        else return value;
    },
    parseProperties(properties) {
        for (const [key, value] of Object.entries(properties))
            properties[key] = this.p.parseProperty.call(this, key, value);

        return properties;
    },
    updateProperty(name, oldValue) {
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

            this.p.respawn.call(this, oldValue);
            if (this.player) {
                this.player.p2._.uuid = this.uuid;
                this.player.p2.respawn.call(this.player);
            }
        }
    },
    async spawn(textures) {
        this.p.sendPacket('player_info', {
            action: 0,
            data: [{
                UUID: this.uuid,
                name: this.p.name,
                displayName: JSON.stringify(this.name.chat),
                properties: (textures || await getSkinTextures(this.p.skinAccountUuid)).properties,
                gamemode: gamemodes.indexOf(this.p.gamemode),
                ping: this.ping === null ? -1 : this.ping
            }]
        });
    },
    remove(oldUuid) {
        this.p.sendPacket('player_info', {
            action: 4,
            data: [{
                UUID: oldUuid ?? this.uuid
            }]
        });
    },
    async respawn(oldUuid) {
        const textures = await getSkinTextures(this.p.skinAccountUuid); //load textures before removing tabItem

        this.p.remove.call(this, oldUuid);
        await this.p.spawn.call(this, textures);
    }
};

const writablePropertyNames = Object.freeze([
    'ping',
    'name',
    'uuid'
]);

class TabItem {
    constructor(p, client, sendPacket, cb, { sendSpawnPacket = true } = {}) {
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
                    let oldValue = this.p._[propertyName];
                    this.p._[propertyName] = this.p.parseProperty.call(this, propertyName, newValue);

                    this.p.updateProperty.call(this, propertyName, oldValue);
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

        if (sendSpawnPacket)
            this
                .p.spawn.call(this)
                .then(() => {
                    tabItems.set.call(this.client, Object.freeze(sortTabItems([...this.client.tabItems, this])));
                    cb(this);
                })
                .catch(e => { throw e });
        else {
            tabItems.set.call(this.client, Object.freeze(sortTabItems([...this.client.tabItems, this])));
            cb(this);
        }
    }

    remove() {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (this.player) {
            this.player.tabItem = null;
            this.player = null;
        }
        this.p.remove.call(this);
        tabItems.set.call(this.client,
            Object.freeze(
                sortTabItems(
                    this.client.tabItems
                        .filter(tabItem => tabItem !== this)
                )
            )
        );
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

function sortTabItems(t) {
    let tabItems = Object.assign([], t);

    tabItems.sort((a, b) => a.p.name === b.p.name ? 0 : a.p.name < b.p.name ? -1 : 1);

    return tabItems;
}

module.exports = TabItem;