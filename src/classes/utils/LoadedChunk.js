const Chunk = require('../exports/Chunk.js');
const { chunks } = require('./Client/properties/public/dynamic/chunks.js')

function updateBlock({ x, y, z, stateId }) {
    this.sendPacket('block_change', {
        location: {
            x,
            y,
            z
        },
        type: stateId
    })
}

class LoadedChunk extends Chunk {
    constructor(client, chunk, { x, z }, sendPacket) {
        super(chunk, block => updateBlock.call(this, block), { x: x * 16, y: 0, z: z * 16 });

        this.sendPacket = sendPacket; // todo: make private

        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;
    }

    remove() {
        this.sendPacket('unload_chunk', {
            chunkX: this.x,
            chunkZ: this.z
        })

        chunks.set.call(this.client, Object.freeze(this.client.chunks.filter(chunk => chunk !== this)));
    }
}

module.exports = LoadedChunk;