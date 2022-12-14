const path = require('path');
const axios = require('axios').default;

const Entity = require('./Entity.js');
const CustomError = require('./CustomError.js');
const Text = require('../exports/Text.js');
const { applyDefaults } = require('../../functions/applyDefaults.js');
const { uuid } = require('../../functions/uuid.js');

const gamemodes = require('../../data/gamemodes.json');

const defaults = require('../../settings.json').defaults;
const playerDefaults = defaults.player;
const { timing: { skinFetchTimeout } } = require('../../settings.json');

const _p = Symbol('private (Player)');
const defaultPrivate = {
    parseProperty: function (key, value) {
        if (key === 'name' && !(value instanceof Text))
            return new Text(value)
        else return value;
    },
    parseProperties: function (properties) {
        for (const [key, value] of Object.entries(properties))
            properties[key] = this.p2.parseProperty.call(this, key, value);

        return properties;
    },
    updateProperty: async function (name) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (name === 'gamemode')
            if (this.tabItem)
                throw new Error('not implemented'); //todo: send gamemode change packet and change this.tabItem.p.gamemode
            else
                await this.p2.respawn();

        if (name === 'uuid')
            if (this.tabItem) {
                this.tabItem.p._.uuid = this.uuid;
                await this.tabItem.p.respawn();
            } else
                await this.p2.respawn();

        if (name === 'name')
            if (this.tabItem) {
                this.tabItem.p._.name = this.name;
                await this.tabItem.p.respawn();
            } else
                await this.p2.respawn();
    },
    async getSkin() {
        const isValidUuid = (typeof this.p2.skinAccountUuid === 'string') && this.p2.skinAccountUuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/g);

        if (!isValidUuid)
            return { properties: [] }
        else
            return await get(`https://sessionserver.mojang.com/session/minecraft/profile/${this.p2.skinAccountUuid}?unsigned=false`); //todo: add try catch and emit CustomError
    },
    remove: function () {
        this.p.sendPacket('entity_destroy', {
            entityIds: [this.id]
        });
    },
    spawn: async function () {
        if (!this.tabItem)
            this.p.sendPacket('player_info', { //create temporary tabItem
                action: 0,
                data: [{
                    UUID: this.uuid,
                    name: this.name.string.slice(2),
                    properties: (await this.p2.getSkin.call(this)).properties,
                    gamemode: gamemodes.indexOf(this.gamemode),
                    ping: -1
                }]
            });

        this.p.sendPacket('named_entity_spawn', {
            entityId: this.id,
            playerUUID: this.uuid,
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            yaw: this.position.yaw,
            pitch: this.position.pitch
        });

        if (!this.tabItem)
            this.p.sendPacket('player_info', { //remove temporary tabItem
                action: 4,
                data: [{
                    UUID: this.uuid
                }]
            });
    },
    respawn: async function () {
        this.p2.remove.call(this);
        await this.p2.spawn.call(this);
    }
};

const writablePropertyNames = Object.freeze([
    'name',
    'gamemode',
    'uuid'
]);

class Player extends Entity {
    constructor(client, type, id, position, sendPacket, extraInfo, overwrites, whenDone) {
        super(client, type, id, position, sendPacket, undefined, { sendSpawnPacket: false });

        // applyDefaults
        extraInfo = applyDefaults(extraInfo, playerDefaults);
        if (extraInfo.tabItem !== null)
            this.tabItem = extraInfo.tabItem;

        if (extraInfo.gamemode === null)
            extraInfo.gamemode = defaults.gamemode;

        if (extraInfo.name === null)
            if (this.tabItem)
                if (this.tabItem.name.string.slice(2).length <= 16)
                    extraInfo.name = this.tabItem.name.string.slice(2);
                else if (this.tabItem.name.uncolored.length <= 16)
                    extraInfo.name = this.tabItem.name.uncolored;
                else
                    extraInfo.name = '';
            else
                extraInfo.name = '';

        if (extraInfo.name.length > 16)
            return this.client.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `name in  new ${this.constructor.name}(.., .., .., .., .., { name: ${require('util').inspect(extraInfo.name)} })  `, {
                got: extraInfo.name,
                expectationType: 'type',
                expectation: 'string.length <= 16',
            }, null, { server: this.server, client: this.client }))

        if (this.tabItem && (extraInfo.uuid === null || extraInfo.uuid === this.tabItem.uuid)) {
            extraInfo.uuid = this.tabItem.uuid;

            this.uuid = extraInfo.uuid;
            this.p2.skinAccountUuid = extraInfo.uuid
        }
        else if (extraInfo.uuid !== null) {
            this.uuid = extraInfo.uuid;
            this.p2.skinAccountUuid = extraInfo.uuid;
        } else if (extraInfo.uuid === null) {
            extraInfo.uuid = uuid().split('');
            extraInfo.uuid[14] = '2'; // set uuid to version 2 so that it can't be a valid client uuid
            extraInfo.uuid = extraInfo.uuid.join('');

            this.uuid = extraInfo.uuid;
            this.p2.skinAccountUuid = null;
        };

        // parseProperties
        extraInfo = this.p2.parseProperties.call(this, extraInfo);

        // set private properties
        this.p2._ = {};
        for (const propertyName of writablePropertyNames)
            this.p2._[propertyName] = extraInfo[propertyName];

        (async () => {
            // update properties if not same as tabItem
            if (this.tabItem) {
                if (extraInfo.gamemode !== this.tabItem.p.gamemode)
                    await this.p2.updateProperty.call(this, 'gamemode');

                if (extraInfo.name.string.slice(2) !== this.tabItem.p.name)
                    await this.p2.updateProperty.call(this, 'name');

                if (extraInfo.uuid !== this.tabItem.uuid)
                    await this.p2.updateProperty.call(this, 'uuid');
            }

            // define getters and setters
            for (const propertyName of writablePropertyNames)
                Object.defineProperty(this, propertyName, {
                    configurable: false,
                    enumerable: true,
                    get: () => this.p2._[propertyName],
                    set: newValue => {
                        // let oldValue = this.p2._[propertyName];
                        this.p2._[propertyName] = this.p2.parseProperty.call(this, propertyName, newValue);

                        this.p2.updateProperty.call(this, propertyName);
                    }
                });

            await this.p2.spawn.call(this);

            whenDone(this);
        })();
    }

    get p2() {
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
            return this.p2._p
    }

    set p2(value) {
        this.p2._p = value;
    }
}

async function get(url) {
    const resp = await axios.get(url, { timeout: skinFetchTimeout });
    const data = await resp.data;

    return data;
}

module.exports = Player;