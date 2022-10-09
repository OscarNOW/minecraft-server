const { version } = require('../../settings.json')

const PChunk = require('prismarine-chunk')(version);

const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class Chunk {
    constructor(isLoadedChunk, pChunk) {
        this.isLoadedChunk = isLoadedChunk;
        this.chunk = pChunk || new PChunk();

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this.chunk.setSkyLight({ x, y, z }, 15)
    }

    setBlock(blockName, { x, y, z }, state = {}) {
        if (this.isLoadedChunk)
            this.updateBlock(blockName, { x, y, z }, state);

        this.chunk.setBlockStateId({ x, y, z }, getBlockStateId.call(this, blockName, state, { function: 'setBlock' }));

        return this;
    }
}

module.exports = Chunk;