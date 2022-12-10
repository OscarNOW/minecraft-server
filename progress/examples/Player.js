const axios = require('axios').default;
const { skinFetchTimeout } = require('../../settings.json').timing;

const Entity = require('./Entity');
const TabItem = require('./TabItem');
const Changable = require('./Changable');

const gamemodes = require('../../data/gamemodes.json');

function sendTabItemStartPacket() {
    this.p.sendPacket('named_entity_spawn', {
        entityId: this.id,
        playerUUID: this.playerInfo.uuid,
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
        yaw: this.position.yaw,
        pitch: this.position.pitch
    });
}

function updateTabItem() {
    this.p.sendPacket('entity_destroy', {
        entityIds: [this.id]
    });

    sendTabItemStartPacket.call(this);
}

async function sendNoTabItemStartPacket() {
    const { properties } = await getSkin.call(this);

    let packet = {
        action: 0,
        data: [{
            UUID: this.playerInfo.uuid,
            name: this.playerInfo.name,
            properties,
            gamemode: gamemodes.indexOf(this.playerInfo.gamemode),
            ping: this.playerInfo.ping === null ? -1 : this.playerInfo.ping
        }]
    };

    if (this.playerInfo.displayName !== null)
        packet.data[0].displayName = JSON.stringify(this.playerInfo.displayName.chat);

    this.sendPacket('player_info', packet);

    sendNoTabItemStartPacket.call(this);

    this.sendPacket('player_info', {
        action: 4,
        data: [{
            UUID: this.playerInfo.uuid
        }]
    });
}

async function updateNoTabItemPlayerInfo() {
    this.p.sendPacket('entity_destroy', {
        entityIds: [this.id]
    });

    sendNoTabItemStartPacket.call(this);
}

async function getSkin() {
    if (!this.skinAccountUuid)
        return { properties: [] }
    else
        return await get(`https://sessionserver.mojang.com/session/minecraft/profile/${this.skinAccountUuid}?unsigned=false`); //todo: add try catch and emit CustomError
}

async function get(url) {
    const resp = await axios.get(url, { timeout: skinFetchTimeout });
    const data = await resp.data;

    return data;
}

class Player extends Entity {
    constructor(client, type, id, position, sendPacket, playerInfo) {
        super(client, type, id, position, sendPacket, {}, { sendSpawnPacket: false });

        this.sendPacket = sendPacket;

        this.hasTabItem = playerInfo instanceof TabItem;
        if (this.hasTabItem) {
            this._playerInfo = playerInfo; //todo: make really private
            sendTabItemStartPacket.call(this);
        } else {
            //todo: parse playerInfo
            this._playerInfo = new Changable(updateNoTabItemPlayerInfo.bind(this), playerInfo); //todo: make really private
            sendNoTabItemStartPacket.call(this);
        }

    }

    get playerInfo() {
        return this._playerInfo;
    }

    set playerInfo(value) {
        if (this.hasTabItem !== (value instanceof TabItem))
            throw new Error('Not implemented') //not implemented

        if (this.hasTabItem) {
            this._playerInfo = value;
            updateTabItem.call(this);
        } else {
            this._playerInfo = new Changable(updateNoTabItemPlayerInfo.bind(this), value);
            updateNoTabItemPlayerInfo.call(this);
        }
    }
}

module.exports = Player;