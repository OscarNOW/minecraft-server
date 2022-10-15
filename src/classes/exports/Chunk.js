const { version } = require('../../settings.json')

const PChunk = require('prismarine-chunk')(version);

const Block = require('../utils/Block.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class Chunk {
    constructor(pChunk, blockUpdateCallback) {
        this.chunk = pChunk || new PChunk();
        this.blockUpdateCallback = blockUpdateCallback;

        this.blocks = {};

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this.chunk.setSkyLight({ x, y, z }, 15)
    }

    setBlock(blockName, { x, y, z }, state = {}) {
        this.chunk.setBlockStateId({ x, y, z }, getBlockStateId.call(this, blockName, state, { function: 'setBlock' }));

        if (blockName == 'air') {
            delete this.blocks[x][y][z];

            if (Object.keys(this.blocks[x][y]).length == 0)
                delete this.blocks[x][y];

            if (Object.keys(this.blocks[x]).length == 0)
                delete this.blocks[x];
        } else {
            if (!this.blocks[x])
                this.blocks[x] = {};

            if (!this.blocks[x][y])
                this.blocks[y] = {};

            this.blocks[x][y][z] = new Block(blockName, state, { x, y, z }, ({ block: { name, state }, x, y, z }) => this.setBlock(name, { x, y, z }, state));
        }

        if (this.blockUpdateCallback)
            this.blockUpdateCallback(arguments[0]);

        return this;
    }
}

module.exports = Chunk;