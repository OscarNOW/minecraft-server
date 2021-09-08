const mc = require('minecraft-protocol');
const version = '1.16.3';
const mcData = require('minecraft-data')(version);
const blocks = require('./blocks.json');
const entities = require('./entities.json');
const prismarineChunk = require('prismarine-chunk')(version);
const Vec3 = require('vec3');
const wait = ms => new Promise(res => setTimeout(res, ms));

class Server {
    constructor({ motd: { text, players } }) {
        let parsedText = parseColorText(text);

        this.motd = { text: parsedText, players };

        this.events = {
            join: []
        }

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version,
            motd: parsedText,
            maxPlayers: players
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
                maxPlayers: players,
                viewDistance: 1000,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: false,
                isFlat: false
            });
            let customClient = new Client(client);

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
        return this.server.playerCount;
    }
}

class Client {
    constructor(client) {
        this.client = client;

        this.skin = this.client.profile.properties[0].value;
        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.ping = this.client.latency;
        this.position = {
            x: null,
            y: null,
            z: null,
            onGround: null
        };
        this.rotation = {
            yaw: null,
            pitch: null
        }

        this.events = {
            chat: [],
            command: [],
            move: [],
            rotate: []
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

        this.client.on('position', ({ x, y, z, onGround }) => {
            if (!(this.position.x == x && this.position.y == y && this.position.z == z && this.position.onGround == onGround)) {
                this.position.x = x;
                this.position.y = y;
                this.position.z = z;
                this.position.onGround = onGround;

                this.events.move.forEach(val => {
                    val();
                })
            }
        });

        this.client.on('look', ({ yaw, pitch }) => {
            if (!(this.rotation.yaw == yaw && this.rotation.pitch == pitch)) {
                this.rotation.yaw = yaw;
                this.rotation.pitch = pitch;

                this.events.rotate.forEach(val => {
                    val();
                })
            }
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

    teleport({ x, y, z }) {
        this.client.write('position', {
            x,
            y,
            z,
            yaw: 0,
            pitch: 0,
            flags: 0x00
        });
    }

    entity(name, { x, y, z }) {
        let entity = getEntity(name);
        if (entity === undefined) throw new Error(`Unknown entity "${name}"`);

        if (entity.living)
            this.client.write('spawn_entity_living', {
                entityId: 1,
                entityUUID: '7ea356f3-e7c8-4f7a-b5be-4551e63c5e54',
                type: entity.id,
                x,
                y,
                z,
                yaw: 0,
                pitch: 0,
                headPitch: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
        else
            this.client.write('spawn_entity', {
                entityId: 3,
                objectUUID: 'eb7b1ec7-9cda-43fa-97bb-ec4979c4813e',
                type: entity.id,
                x,
                y,
                z,
                pitch: 0,
                yaw: 0,
                objectData: 0,
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0
            })
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

function getBlockId(blockName) {
    if (typeof blocks[blockName] == 'number')
        return blocks[blockName]

    if (typeof blocks[blockName] == 'string')
        return getBlockId(blocks[blockName])

    if (blocks[blockName] === null)
        return null;

    return undefined;
}

function getEntity(entityName) {
    if (entities[entityName])
        return entities[entityName]

    return undefined;
}

module.exports = { Server, Chunk }

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