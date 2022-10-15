const Chunk = require('../exports/Chunk.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

function updateBlock({ block: { name, state }, x, y, z }) {
    let stateId = getBlockStateId.call(this, name, state);

    this.client.p.sendPacket('block_change', {
        location: {
            x: this.x * 16 + x,
            y,
            z: this.z * 16 + z
        },
        type: stateId
    })
}

class LoadedChunk extends Chunk {
    constructor(client, pChunk, { x, z }) {
        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;

        super(pChunk, updateBlock.bind(this));
    }
}

module.exports = LoadedChunk;