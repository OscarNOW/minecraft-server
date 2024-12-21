const { applyDefaults } = require('../../functions/applyDefaults');
const { uuid: generateUuid } = require('../../functions/uuid');
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
        else if (name === 'name') {
            //todo: use <Text> onChange event
            this.p.sendPacket('player_info', {
                action: 3,
                data: [{
                    UUID: this.uuid,
                    displayName: JSON.stringify(this.name.chat)
                }]
            })
        } else if (name === 'uuid') {
            this.p.textures = null;

            if (this.player) {
                this.player.p2._.uuid = this.uuid;
                this.player.p2.respawn.call(this.player);
            } else
                this.p.respawn.call(this, oldValue);
        }
        else if (name === 'skinAccountUuid') {
            this.p.textures = null;

            if (this.player) {
                this.player.p2._.skinAccountUuid = this.skinAccountUuid;
                this.player.p2.respawn.call(this.player);
            } else
                this.p.respawn.call(this, oldValue);
        }
    },
    async spawn(textures) {
        this.p.sendPacket('player_info', {
            action: 0,
            data: [{
                UUID: this.uuid,
                name: this.p.name, // this the name used if a Player is spawned
                displayName: JSON.stringify(this.name.chat),
                properties: (textures || await getSkinTextures(this.skinAccountUuid)).properties,
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
        //todo: why can't we get the skinTextures after the TabItem is removed?
        const textures = await getSkinTextures(this.skinAccountUuid); //load textures before removing tabItem

        this.p.remove.call(this, oldUuid);
        await this.p.spawn.call(this, textures);
    }
};

const writablePropertyNames = Object.freeze([
    'ping',
    'name',
    'uuid',
    'skinAccountUuid'
]);

class TabItem {
    constructor(p, client, sendPacket, cb, { sendSpawnPacket = true } = {}) {
        this.client = client;
        this.server = client.server;
        this.p.sendPacket = sendPacket;

        (async () => {
            let properties = typeof p === 'object' ? Object.assign({}, p) : p;
            properties = applyDefaults(properties, tabItemDefaults);

            this.player = properties.player;
            this.p.gamemode = settings.defaults.gamemode;

            let { uuid, skinAccountUuid } = getUuids({
                uuid: properties.uuid,
                skinAccountUuid: properties.skinAccountUuid,
                player: this.player
            });
            properties.uuid = uuid;
            properties.skinAccountUuid = skinAccountUuid;

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

            //todo: implement sorting TabItems (ie setIndex functions), because MC Client sorts tabItems based on name
            this.p.name = '';

            let spawned = false;
            if (this.player) {
                //todo: check if player already has tabItem and throw error

                this.p.name = this.player.name.string.slice(2);
                this.gamemode = this.player.gamemode;

                if (
                    this.skinAccountUuid !== this.player.skinAccountUuid ||
                    this.uuid !== this.player.uuid
                ) {
                    const oldPlayerUuid = this.player.uuid;

                    this.player.p2._.skinAccountUuid = this.skinAccountUuid;
                    this.player.p2._.uuid = this.uuid;

                    await this.player.p2.respawn.call(this.player, oldPlayerUuid);
                    spawned = true;
                } else {
                    //todo: update other player properties?
                }

                this.player.tabItem = this;
            }

            if (!this.client.p.stateHandler.checkReady.call(this.client))
                return;

            if (sendSpawnPacket && !spawned)
                await this.p.spawn.call(this)

            tabItems.set.call(this.client, Object.freeze(sortTabItems([...this.client.tabItems, this])));
            cb(this);
        })();
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

function getUuids({ uuid: givenUuid, skinAccountUuid: givenSkinAccountUuid, player }) {
    let skinAccountUuid = null;
    let uuid = null;

    if (givenSkinAccountUuid)
        skinAccountUuid = givenSkinAccountUuid;

    if (givenUuid) {
        uuid = givenUuid;
        if (!skinAccountUuid)
            skinAccountUuid = givenUuid;
    }

    if (player?.skinAccountUuid && !skinAccountUuid)
        skinAccountUuid = player.skinAccountUuid;
    if (player?.uuid && !uuid)
        uuid = player.uuid;

    if (!uuid) {
        uuid = generateUuid().split('');
        uuid[14] = '2'; // set uuid to version 2 so that it can't be a valid client uuid
        uuid = uuid.join('');
    }

    return { uuid, skinAccountUuid };
}

module.exports = TabItem;