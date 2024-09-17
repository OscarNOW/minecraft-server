const path = require('path');

const Entity = require('./Entity.js');
const TabItem = require('./TabItem.js');
const CustomError = require('./CustomError.js');
const Text = require('../exports/Text.js');
const { applyDefaults } = require('../../functions/applyDefaults.js');
const { getSkinTextures } = require('../../functions/getSkinTextures');
const { uuid } = require('../../functions/uuid.js');
const settings = require('../../settings.json');

const { gamemodes, entities } = require('../../functions/loader/data.js');

const defaults = require('../../settings.json').defaults;
const playerDefaults = defaults.player;

const _p = Symbol('_privates');
const defaultPrivate = {
    parseProperty(key, value) {
        if (key === 'name' && !(value instanceof Text))
            return new Text(value)
        else return value;
    },
    parseProperties(properties) {
        for (const [key, value] of Object.entries(properties))
            properties[key] = this.p2.parseProperty.call(this, key, value);

        return properties;
    },
    async updateProperty(name) {
        if (!this.client.p.stateHandler.checkReady.call(this.client))
            return;

        if (name === 'gamemode')
            if (this.tabItem)
                this.tabItem.gamemode = this.gamemode;
            else
                //we have to respawn, because client doesn't accept change packet
                await this.p2.respawn.call(this);

        if (name === 'uuid') {
            this.p2.textures = null;

            if (this.tabItem)
                this.tabItem.uuid = this.uuid;
            else
                await this.p2.respawn.call(this);
        }

        if (name === 'skinAccountUuid') {
            this.p2.textures = null;

            if (this.tabItem)
                this.tabItem.skinAccountUuid = this.skinAccountUuid;
            else
                await this.p2.respawn.call(this);
        }

        if (name === 'name')
            if (this.tabItem)
                this.tabItem.name = this.name;
            else
                //we have to respawn, because client doesn't accept change packet
                await this.p2.respawn.call(this);
    },
    remove() {
        if (this.tabItem) {
            //sends player_info action 4 (=remove) packet
            this.tabItem.p.remove.call(this.tabItem);
        }

        this.p.sendPacket('entity_destroy', {
            entityIds: [this.id]
        });
    },
    async spawn(textures, preventTabItemPacket = false) {
        this.p.sendPacket('spawn_entity_living', {
            entityId: this.id,
            entityUUID: this.uuid,
            type: entities.findIndex(({ name }) => name === 'player'),
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            yaw: this.position.yaw,
            pitch: this.position.pitch,
            headPitch: 0, //todo
            velocityX: 0, //todo
            velocityY: 0, //todo
            velocityZ: 0, //todo
        });

        if (!preventTabItemPacket)
            if (this.tabItem) {
                //sends player_info packet
                await this.tabItem.p.spawn.call(this.tabItem, textures);
            } else {
                let name;
                if (this.name.string.slice(2).length <= 16)
                    name = this.name.string.slice(2);
                else if (this.name.uncolored.length <= 16)
                    name = this.name.uncolored;
                else
                    name = '';

                this.p.sendPacket('player_info', {
                    action: 0,
                    data: [{
                        UUID: this.uuid,
                        name,
                        displayName: JSON.stringify(this.name.chat),
                        properties: (textures || await getSkinTextures(this.skinAccountUuid)).properties,
                        gamemode: gamemodes.indexOf(this.p.gamemode),
                        ping: -1
                    }]
                });
            }

        this.p.sendPacket('named_entity_spawn', {
            entityId: this.id,
            playerUUID: this.uuid,
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            yaw: this.position.yaw,
            pitch: this.position.pitch
        });

        if (!this.tabItem && !preventTabItemPacket) {
            await new Promise(res => setTimeout(res, settings.timing.skinLoadTime));

            this.p.sendPacket('player_info', {
                action: 4,
                data: [{
                    UUID: this.uuid
                }]
            });
        }
    },
    async respawn() {
        const textures = await getSkinTextures(this.skinAccountUuid);

        this.p2.remove.call(this);
        await this.p2.spawn.call(this, textures);
    }
};

function getUuids({ uuid: givenUuid, skinAccountUuid: givenSkinAccountUuid, tabItem }) {
    let skinAccountUuid = null;
    let uuid = null;

    if (givenSkinAccountUuid)
        skinAccountUuid = givenSkinAccountUuid;

    if (givenUuid) {
        uuid = givenUuid;
        if (!skinAccountUuid)
            skinAccountUuid = givenUuid;
    }

    if (tabItem?.skinAccountUuid && !skinAccountUuid)
        skinAccountUuid = tabItem.skinAccountUuid;
    if (tabItem?.uuid && !uuid)
        uuid = tabItem.uuid;

    if (!uuid) {
        uuid = uuid().split('');
        uuid[14] = '2'; // set uuid to version 2 so that it can't be a valid client uuid
        uuid = uuid.join('');
    }

    return { uuid, skinAccountUuid };
}

const writablePropertyNames = Object.freeze([
    'name',
    'gamemode',
    'uuid',
    'skinAccountUuid'
]);

class Player extends Entity {
    constructor(client, type, id, position, sendPacket, extraInfo, overwrites, cb) {
        //todo: pass extraInfo to super
        //todo: also call overwrites.beforeRemove when player is removed
        //todo: don't send spawn packet if sendSpawnPacket is false
        super(client, type, id, position, sendPacket, undefined, {
            sendSpawnPacket: false,
            beforeRemove: [(() => {
                if (this.tabItem) {
                    this.tabItem.player = null;
                    this.tabItem = null;
                }
            })]
        });

        (async () => {
            // applyDefaults
            extraInfo = applyDefaults(extraInfo, playerDefaults);
            if (extraInfo.tabItem !== null)
                this.tabItem = extraInfo.tabItem;

            if (extraInfo.gamemode === null)
                extraInfo.gamemode = defaults.gamemode;

            let { uuid, skinAccountUuid } = getUuids({
                uuid: extraInfo.uuid,
                skinAccountUuid: extraInfo.skinAccountUuid,
                tabItem: this.tabItem
            });
            extraInfo.uuid = uuid;
            extraInfo.skinAccountUuid = skinAccountUuid;

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
                    expectation: 'string.length <= 16'
                }, null, { server: this.server, client: this.client }))

            // parseProperties
            extraInfo = this.p2.parseProperties.call(this, extraInfo);

            // set private properties
            this.p2._ = {};
            for (const propertyName of writablePropertyNames)
                this.p2._[propertyName] = extraInfo[propertyName];

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

            if (this.tabItem) {
                if (this.skinAccountUuid !== this.tabItem.skinAccountUuid || this.uuid !== this.tabItem.uuid) {
                    this.tabItem.p._.skinAccountUuid = this.skinAccountUuid;
                    this.tabItem.p._.uuid = this.uuid;
                    await this.tabItem.p.respawn.call(this.tabItem);
                } else {
                    if (this.gamemode !== this.tabItem.gamemode)
                        this.tabItem.gamemode = this.gamemode;

                    if (this.name.hash !== this.tabItem.name.hash)
                        this.tabItem.name = this.name;
                }

                this.tabItem.player = this; //todo: check if tabItem already has Player and throw error
            }

            await this.p2.spawn.call(this, undefined, true);
            cb(this);
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

module.exports = Player;