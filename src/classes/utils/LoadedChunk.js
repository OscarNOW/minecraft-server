const Chunk = require('../exports/Chunk.js');

function updateBlock({ x, y, z, stateId }) {
    this.sendPacket('block_change', {
        location: {
            x: this.x * 16 + x,
            y,
            z: this.z * 16 + z
        },
        type: stateId
    })
}

class LoadedChunk extends Chunk {
    constructor(client, chunk, { x, z }, sendPacket) {
        super(chunk, () => updateBlock.call(this));

        this.sendPacket = sendPacket;

        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;
    }
}

module.exports = LoadedChunk;