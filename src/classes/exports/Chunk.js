const { version } = require('../../settings.json')

const PChunk = require('prismarine-chunk')(version);

const Block = require('../utils/Block.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

function updateBlock({ block: { name, state }, x, y, z }) {
    this.chunk.setBlockStateId({ x, y, z }, getBlockStateId.call(this, name, state));

    if (this.blockUpdateCallback)
        this.updateBlock(arguments[0]);

    return this;
}

class Chunk {
    constructor(pChunk, blockUpdateCallback) {
        this.chunk = pChunk || new PChunk();
        this.blockUpdateCallback = blockUpdateCallback;

        this.blocks = [];

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++) {
                    this.chunk.setSkyLight({ x, y, z }, 15)
                    this.blocks.push(new Block('air', {}, { x, y, z }, updateBlock.bind(this)));
                }
    }
}

module.exports = Chunk;