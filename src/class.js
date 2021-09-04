const mc = require('minecraft-protocol');
const version = '1.16.3';
const mcData = require('minecraft-data')(version);
const blocks = require('./blocks.json');
const prismarineChunk = require('prismarine-chunk')('1.16.3');
const Vec3 = require('vec3');

class Server {
    constructor({ motd: { text, players } }) {
        let parsedText = parseMotdText(text);

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

        this.server.on('login', client => {

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
                viewDistance: 10,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: false,
                isFlat: false
            });

            let customClient = new Client(client);

            this.events.join.forEach(val => {
                val(customClient)
            })
        });

    }

    on(event, callback) {
        if (!this.events[event]) throw new Error(`Invalid event "${event}"`)
        this.events[event].push(callback);
    }
}

class Client {
    constructor(client) {
        this.client = client;

        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.ping = this.client.latency;

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
        if (!blocks[block] && blocks[block] !== 0) throw new Error(`Unknown block "${block}"`);

        this.chunk.setBlockType(new Vec3(x, y, z), blocks[block]);
        this.chunk.setBlockData(new Vec3(x, y, z), 1);

        return this;
    }
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

function parseMotdText(string) {
    let s = string;
    replacements.forEach(val => {
        s = s.replace(`&${val}`, `§${val}`)
    })
    return s
}