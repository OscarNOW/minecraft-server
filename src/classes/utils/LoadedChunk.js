const Chunk = require('../exports/Chunk.js');

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

        this.sendPacket = sendPacket;

        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;
    }
}

module.exports = LoadedChunk;