const { version } = require('../../settings.json');
const { chunkSize } = require('../../functions/loader/data.js');

const PChunk = require('prismarine-chunk')(version);

const CustomError = require('../utils/CustomError.js');
const Block = require('../utils/Block.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class Chunk {
    constructor(chunk, blockUpdateCallback, blocksOffset) {
        this.blockUpdateCallback = blockUpdateCallback || chunk?.blockUpdateCallback || undefined;
        this.blocksOffset = blocksOffset || chunk?.blocksOffset || { x: 0, y: 0, z: 0 };

        //copy prismarine chunk to allow new chunk to be changed without affecting the original
        this._chunk = new PChunk();
        this.chunkSet = !chunk?.chunk;

        this.blocks = {};
        if (chunk?.blocks)

            for (const x in chunk.blocks)
                for (const y in chunk.blocks[x])
                    for (const z in chunk.blocks[x][y]) {
                        if (!this.blocks[x])
                            this.blocks[x] = {};

                        if (!this.blocks[x][y])
                            this.blocks[x][y] = {};

                        this.blocks[x][y][z] = new Block(chunk.blocks[x][y][z].block, chunk.blocks[x][y][z].state, { x: parseInt(x) + this.blocksOffset.x, y: parseInt(y) + this.blocksOffset.y, z: parseInt(z) + this.blocksOffset.z });
                    }

    }

    get chunk() {
        if (this.chunkSet)
            return this._chunk;

        for (const x in this.blocks)
            for (const y in this.blocks[x])
                for (const z in this.blocks[x][y])
                    this._chunk.setBlockStateId({ x, y, z }, getBlockStateId(this.blocks[x][y][z].block, this.blocks[x][y][z].state));

        this.chunkSet = true;

        return this._chunk;
    }

    setBlock(blockName, { x, y, z }, state = {}) {
        if (x < chunkSize.x.min || x > chunkSize.x.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `x in  ${this.constructor.name}.setBlock(..., {x: x, ... }, ...)  `, {
                got: x,
                expectationType: 'value',
                expectation: new Array(chunkSize.x.max - chunkSize.x.min).fill(0).map((_, i) => i + chunkSize.x.min),
            }, this.setBlock).toString()

        if (y < chunkSize.y.min || y > chunkSize.y.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `y in  ${this.constructor.name}.setBlock(..., {y: y, ... }, ...)  `, {
                got: y,
                expectationType: 'value',
                expectation: new Array(chunkSize.y.max - chunkSize.y.min).fill(0).map((_, i) => i + chunkSize.y.min),
            }, this.setBlock).toString()

        if (z < chunkSize.z.min || z > chunkSize.z.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `z in  ${this.constructor.name}.setBlock(..., {z: z, ... }, ...)  `, {
                got: z,
                expectationType: 'value',
                expectation: new Array(chunkSize.z.max - chunkSize.z.min).fill(0).map((_, i) => i + chunkSize.z.min),
            }, this.setBlock).toString()

        if (this.chunkSet)
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
                this.blocks[x][y] = {};

            this.blocks[x][y][z] = new Block(blockName, state, { x: x + this.blocksOffset.x, y: y + this.blocksOffset.y, z: z + this.blocksOffset.z });
        }

        if (this.blockUpdateCallback)
            this.blockUpdateCallback(this.blocks[x][y][z]);

        return this;
    }
}

module.exports = Chunk;