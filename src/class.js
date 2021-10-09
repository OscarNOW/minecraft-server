const version = '1.16.3';
const mc = require('minecraft-protocol');
const Vec3 = require('vec3');
const { v4: uuid } = require('uuid');
const http = require('http');
const https = require('https');
const prismarineChunk = require('prismarine-chunk')(version);
const mcData = require('minecraft-data')(version);
const blocks = require('./blocks.json');
const entities = require('./entities.json');
const protocolVersions = require('./protocolVersions.json');
const wait = ms => new Promise(res => setTimeout(res, ms));

class Server {
    constructor({ serverList }) {

        this.serverList = serverList;
        this.clients = [];

        this.events = {
            join: [],
            leave: []
        }

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version,
            beforePing: (response, client) => {

                let info = this.serverList(client.socket.remoteAddress);
                let parsedText = parseColorText(info.description);

                return {
                    version: {
                        name: info.versionMessage,
                        protocol: protocolVersions[version]
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: info.players.hover.split('\n').map(val => {
                            return { name: val, id: '00000000-0000-4000-0000-100000000000' }
                        })
                    },
                    description: parsedText
                }
            }
        })

        this.server.on('login', async client => {

            if (client.version != version)
                return client.end(`Please use version ${version}`)

            client.write('login', {
                entityId: client.id,
                isHardcore: false,
                gameMode: 0,
                previousGameMode: 255,
                worldNames: mcData.loginPacket.worldNames,
                dimensionCodec: mcData.loginPacket.dimensionCodec,
                dimension: mcData.loginPacket.dimension,
                worldName: 'minecraft:overworld',
                hashedSeed: [0, 0],
                maxPlayers: 0,
                viewDistance: 1000,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: false,
                isFlat: false
            });
            let customClient = new Client(client, this);

            this.clients.push(customClient);

            this.events.join.forEach(val => {
                val(customClient)
            });
        });

    }

    on(event, callback) {
        if (!this.events[event]) throw new Error(`Invalid event "${event}"`)
        this.events[event].push(callback);
    }

    get playerCount() {
        if (this.server.playerCount != this.clients.length)
            throw new Error(`Internal error\n    at Clients length (${this.clients.length}) does not equal playercount (${this.server.playerCount})`)

        return this.clients.length;
    }
}

class Client {
    constructor(client, server) {
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

        this.cachedPosition = {
            x: null,
            y: null,
            z: null,
            onGround: null,
            yaw: null,
            pitch: null
        };

        this.entities = {};

        this.events = {
            chat: [],
            command: [],
            move: [],
            leave: []
        }

        this.client.on('chat', ({ message }) => {
            if (message.startsWith('/'))
                this.events.command.forEach(val => {
                    val(message.split('/').slice(1).join('/'))
                })
            else
                this.events.chat.forEach(val => {
                    val(message);
                })
        })

        this.client.on('position', i => this.emitMove(i));
        this.client.on('position_look', i => this.emitMove(i));
        this.client.on('look', i => this.emitMove(i));
        this.client.on('flying', i => this.emitMove(i));

    }

    get online() {
        return this.client.socket.readyState == 'open';
    }

    set online(val) {
        if (val === false)
            throw new Error(`Can't set online, please use "Client.kick" for that`)
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
            'yaw',
            'onGround'
        ].forEach(val => {
            if (info[val] !== undefined && this.cachedPosition[val] != info[val]) {
                changed = true;
                this.cachedPosition[val] = info[val];
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
                value: {} // Client will accept fake heightmap
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

    window(window, horse) {
        if (window.windowId == 'EntityHorse')
            if (!horse)
                throw new Error('No horse given')
            else
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
        // httpRequest({
        //     host: 'sessionserver.mojang.com',
        //     method: 'GET',
        //     path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        // }).then(inf => {
        //     console.log(inf.properties)
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

class Entity {
    constructor(client, type, id, { x, y, z, yaw, pitch }) {
        let e = getEntity(type);
        if (e === undefined) throw new Error(`Unknown entity "${type}"`)

        this.position = { x, y, z, yaw, pitch };
        this.type = type;
        this.living = e.living;
        this.typeId = e.id;
        this.id = id;
        this.uuid = uuid();
        this.client = client;

        if (this.living)
            this.client.client.write('spawn_entity_living', {
                entityId: this.id, //1
                entityUUID: this.uuid,
                type: this.typeId,
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                yaw: this.position.yaw,
                pitch: this.position.pitch,
                headPitch: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
        else
            this.client.client.write('spawn_entity', {
                entityId: this.id, //3
                objectUUID: this.uuid,
                type: this.typeId,
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                pitch: this.position.pitch,
                yaw: this.position.yaw,
                objectData: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
    }

    move({ x, y, z, yaw: ya, pitch }) {

        let yaw = ya;
        if (yaw > 127)
            yaw = -127;

        if (yaw < -127)
            yaw = 127

        this.client.client.write('entity_teleport', {
            entityId: this.id,
            x,
            y,
            z,
            yaw,
            pitch,
            onGround: true
        })

        this.position = { x, y, z, yaw, pitch }
    }
}

class Chunk {
    constructor() {
        this.chunk = new prismarineChunk();

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this.chunk.setSkyLight(new Vec3(x, y, z), 15)
    }

    setBlock(block, { x, y, z }) {
        let blockId = getBlockId(block);
        if (blockId === null) throw new Error(`Unknown block "${block}"`);

        this.chunk.setBlockType(new Vec3(x, y, z), blockId);
        this.chunk.setBlockData(new Vec3(x, y, z), 1);

        return this;
    }
}

const windowNameIdMapping = {
    'horse': 'EntityHorse',
    'anvil': 'minecraft:anvil',
    'beacon': 'minecraft:beacon',
    'brewing_stand': 'minecraft:brewing_stand',
    'chest': 'minecraft:chest',
    'container': 'minecraft:container',
    'crafting_table': 'minecraft:crafting_table',
    'dispenser': 'minecraft:dispenser',
    'dropper': 'minecraft:dropper',
    'enchanting_table': 'minecraft:enchanting_table',
    'furnace': 'minecraft:furnace',
    'hopper': 'minecraft:hopper',
    'villager': 'minecraft:villager'
};

class Window {
    constructor(windowType) {
        this.windowType = windowType;

        if (!windowNameIdMapping[this.windowType]) throw new Error(`Unknown windowType "${windowType}"`)
        this.windowId = windowNameIdMapping[this.windowType];
    }
}

function getBlockId(blockName) {
    if (typeof blocks[blockName] == 'number')
        return blocks[blockName]

    if (typeof blocks[blockName] == 'string')
        return getBlockId(blocks[blockName])

    if (blocks[blockName] === null)
        return null;

    return undefined;
}

function getEntity(type) {
    if (entities[type])
        return entities[type]

    return undefined;
}

module.exports = { Server, Chunk, Window }

let replacements = [
    '4',
    'c',
    '6',
    'e',
    '2',
    'a',
    'b',
    '3',
    '1',
    '9',
    'd',
    '5',
    'f',
    '7',
    '8',
    '0',
    'r',
    'l',
    'o',
    'n',
    'm',
    'k'
];
replacements.forEach(val => {
    replacements.push(val.toLowerCase())
})

function parseColorText(string) {
    let s = string;
    replacements.forEach(val => {
        s = s.replace(`&${val}`, `§${val}`)
    })
    return s
}

function httpRequest(params, postData) {
    return new Promise((resolve, reject) => {
        var req = https.request(params, res => {
            if (res.statusCode < 200 || res.statusCode >= 300)
                return reject(new Error('statusCode=' + res.statusCode));

            var body = [];
            res.on('data', chunk => {
                body.push(chunk);
            });

            res.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });

        req.on('error', err => {
            reject(err);
        });

        if (postData)
            req.write(postData);

        req.end();
    });
}