const Entity = require('./Entity').Entity;
const ChangablePosition = require('./ChangablePosition').ChangablePosition;
const windowNameIdMapping = require('../../data/windowNameIdMapping.json');
const languages = require('../../data/languages.json');
const wait = ms => new Promise(res => setTimeout(res, ms));

class Client {
    constructor(client, server) {
        const that = this;
        let joined = false;

        this.client = client;
        this.server = server;

        this.skin = this.client.profile.properties[0].value;
        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.ping = this.client.latency;

        (async () => {
            while (this.online)
                await wait(500)

            this.server.clients = this.server.clients.filter(client => client.online);
            this.events.leave.forEach(val => {
                val();
            });
            this.server.events.leave.forEach(val => {
                val(this);
            })
        })();

        this.cachedPosition = new ChangablePosition(i => that.teleport.call(that, i), {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        })

        this.entities = {};

        this.events = {
            chat: [],
            move: [],
            leave: []
        }

        this.client.on('chat', ({ message }) => {
            this.events.chat.forEach(val => {
                val(message);
            })
        })

        this.client.on('position', i => this.emitMove(i));
        this.client.on('position_look', i => this.emitMove(i));
        this.client.on('look', i => this.emitMove(i));
        this.client.on('flying', i => this.emitMove(i));

        this.client.on('settings', ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) => {
            if (!languages[locale]) throw new Error(`Unknown language code "${locale}"`)
            let obj = {
                code: locale,
                name: languages[locale].name
            };

            if (languages[locale].localName) obj.localName = languages[locale].localName;

            this.locale = obj;
            this.viewDistance = viewDistance;

            if (!joined) {
                joined = true;
                this.server.clients.push(this);
                this.server.events.join.forEach(val => val(this));
            }

            console.log({
                username: this.username,
                chatFlags
            })
        })

    }

    get online() {
        return this.client.socket.readyState == 'open';
    }

    set online(val) {
        if (val === false)
            throw new Error(`Can't set online, please use "<Client>.kick" for that`)
        else
            throw new Error("Can't set online")
    }

    get position() {
        return this.cachedPosition;
    }

    set position(val) {
        this.teleport(val)
    }

    emitMove(info) {
        let changed = false;
        [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ].forEach(val => {
            if (info[val] !== undefined && this.cachedPosition[val] != info[val]) {
                changed = true;
                this.cachedPosition.raw[val] = info[val];
            }
        });

        if (changed)
            this.events.move.forEach(val => {
                val();
            })
    }

    on(event, callback) {
        if (!this.events[event]) throw new Error(`Invalid event "${event}"`)
        this.events[event].push(callback);
    }

    kick(reason) {
        this.client.end(reason);
    }

    chat(message) {
        this.client.write('chat', {
            message: JSON.stringify({ translate: message }),
            position: 0,
            sender: '0'
        });
    }

    chunk(chunk, { x, z }) {
        this.client.write('map_chunk', {
            x,
            z,
            groundUp: true,
            biomes: chunk.chunk.dumpBiomes !== undefined ? chunk.chunk.dumpBiomes() : undefined,
            heightmaps: {
                type: 'compound',
                name: '',
                value: {}
            },
            bitMap: chunk.chunk.getMask(),
            chunkData: chunk.chunk.dump(),
            blockEntities: []
        })
    }

    teleport({ x, y, z, yaw, pitch }) {
        this.client.write('position', {
            x,
            y,
            z,
            yaw,
            pitch,
            flags: 0x00
        });
    }

    entity(type, { x, y, z, yaw, pitch }) {
        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch });

        this.entities[entityId] = entity;
        return entity;
    }

    window(windowType, horse) {

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}"`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

        let windowId = windowNameIdMapping[windowType];

        if (windowId == 'EntityHorse')
            this.client.write('open_horse_window', {
                windowId: 1,
                nbSlots: 2,
                entityId: horse.id
            })
        else
            throw new Error(`Not implemented`)
    }

    player() {
        throw new Error(`Not implemented`)
        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this.client.write('player_info', {
            action: 0,
            data: [
                {
                    UUID: this.uuid,
                    name: this.username,
                    // properties: inf.properties,
                    properties: [],
                    gamemode: 0,
                    ping: this.ping,
                    displayName: this.username
                }
            ]
        })
        // })
    }
}

module.exports = { Client }