const mc = require('minecraft-protocol');
const version = '1.16.3';
const mcData = require('minecraft-data')(version);
const blocks = require('./blocks.json');
const entities = require('./entities.json');
const prismarineChunk = require('prismarine-chunk')(version);
const Vec3 = require('vec3');
const { v4: uuid } = require('uuid');
const wait = ms => new Promise(res => setTimeout(res, ms));

class Server {
    constructor({ motd: { text, players } }) {
        let parsedText = parseColorText(text);

        this.motd = { text: parsedText, players };
        this.clients = [];

        this.events = {
            join: [],
            leave: []
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
            throw new Error('Internal error (x01)')

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

            this.server.clients = this.server.clients.filter(client => client.uuid != this.uuid);
            this.events.leave.forEach(val => {
                val();
            });
            this.server.events.leave.forEach(val => {
                val(this);
            })
        })();

        this.position = {
            x: null,
            y: null,
            z: null,
            onGround: null,
            yaw: null,
            pitch: null
        };

        this.entities = [];

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
            if (info[val] !== undefined && this.position[val] != info[val]) {
                changed = true;
                this.position[val] = info[val];
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

    teleport({ x, y, z }) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.client.write('position', {
            x,
            y,
            z,
            yaw: 0,
            pitch: 0,
            flags: 0x00
        });
    }

    entity(type, { x, y, z, yaw, pitch }) {
        let entity = new Entity(this, type, { x, y, z, yaw, pitch });

        this.entities.push(entity);
        return this.entities.length - 1;
    }

    get online() {
        return this.client.socket.readyState == 'open';
    }
}

class Entity {
    constructor(client, type, { x, y, z, yaw, pitch }) {
        let e = getEntity(type);
        if (e === undefined) throw new Error(`Unknown entity "${type}"`)

        this.position = { x, y, z, yaw, pitch };
        this.type = type;
        this.living = e.living;
        this.id = e.id;
        this.uuid = uuid();
        this.client = client;

        if (this.living)
            this.client.client.write('spawn_entity_living', {
                entityId: 1,
                entityUUID: this.uuid,
                type: this.id,
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
                entityId: 3,
                objectUUID: this.uuid,
                type: this.id,
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

    teleport({ x, y, z, yaw, pitch }) {
        throw new Error('Not implemented')

        let samePosition =
            this.position.x == x &&
            this.position.y == y &&
            this.position.z == z;

        let sameRotation =
            this.position.yaw == yaw &&
            this.position.pitch == pitch;

        if (samePosition && sameRotation) return
        else if (samePosition)
            this.client.client.write('entity_look', {
                entityId: 1,
                onGround: false,
                yaw,
                pitch
            })
        else if (sameRotation)
            this.client.client.write('rel_entity_move', {
                entityId: 1,
                onGround: false,
                dX: x - this.position.x,
                dY: y - this.position.y,
                dZ: z - this.position.z
            })
        else
            this.client.client.write('entity_move_look', {
                entityId: 1,
                onGround: false,
                dX: x - this.position.x,
                dY: y - this.position.y,
                dZ: z - this.position.z,
                yaw,
                pitch
            })

        this.position = { x, y, z, yaw, pitch }
    }

    addClient(client) {
        this.clients.push(client)


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

function getEntity(type) {
    if (entities[type])
        return entities[type]

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