const Chunk = require('../exports/Chunk.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class LoadedChunk extends Chunk {
    constructor(client, pChunk, { x, z }) {
        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;

        super(true, pChunk);
    }

    updateBlock(blockName, { x, y, z }, state = {}) {
        let stateId = getBlockStateId.call(this, blockName, state, { function: 'setBlock' });

        this.client.p.sendPacket('block_change', {
            location: {
                x: this.x * 16 + x,
                y,
                z: this.z * 16 + z
            },
            type: stateId
        })
    }
}

module.exports = LoadedChunk;