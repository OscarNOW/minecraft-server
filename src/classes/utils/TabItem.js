const { applyDefaults } = require('../../functions/applyDefaults');
const { gamemodes } = require('../../functions/loader/data.js');
const { tabItems } = require('./Client/properties/public/dynamic/tabItems.js');

const defaults = require('../../settings.json').defaults.tabItem;
const { timing: { skinFetchTimeout } } = require('../../settings.json');

const Text = require('../exports/Text.js');
const axios = require('axios').default;

//todo: add getters and setters that send packets
class TabItem {
    constructor(tabItemOptions, client, sendPacket) {
        this.client = client;
        this.server = client.server;
        this.sendPacket = sendPacket; //todo: make private

        const options = applyDefaults(tabItemOptions, defaults);
        let { name, uuid, gamemode, ping } = options;

        this.name = name;
        this.uuid = uuid;
        this.gamemode = gamemode; //todo: add check if valid and emit CustomError if not
        this.ping = ping; //todo: add check if valid and emit CustomError if not

        let { displayName } = options;
        if (displayName !== null && !(displayName instanceof Text))
            displayName = new Text(displayName);

        this.displayName = displayName;

        let { skinAccountUuid } = options;
        //todo: check if skinAccountUuid is uuid to avoid uri injection

        this.skinAccountUuid = skinAccountUuid;

        tabItems.setPrivate.call(this.client, Object.freeze([...this.client.tabItems, this]));

        this.sendStartPacket();
    }
    async getSkin() { //todo: make method private
        if (!this.skinAccountUuid)
            return { properties: [] }
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
            packet.displayName = this.displayName.chat;

        this.sendPacket('player_info', packet);
    }
}

async function get(url) {
    const resp = await axios.get(url, { timeout: skinFetchTimeout });
    const data = await resp.data;

    return data;

}

module.exports = TabItem;