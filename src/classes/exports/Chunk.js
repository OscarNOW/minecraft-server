const { version } = require('../../settings.json');
const { chunkSize } = require('../../functions/loader/data.js');

const crypto = require('crypto');
const path = require('path');

const CustomError = require('../utils/CustomError.js');
const Block = require('../utils/Block.js');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

let cachedPChunk;
const PChunk = () => {
    if (cachedPChunk === undefined)
        cachedPChunk = require('prismarine-chunk')(`${version}`);

    return cachedPChunk;
};

const _p = Symbol('_privates');
let chunkDataCache = {};

class Chunk {
    constructor(chunk, blockUpdateCallback, blocksOffset) {
        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });

        this.blockUpdateCallback = blockUpdateCallback || chunk?.blockUpdateCallback || undefined;
        this.blocksOffset = blocksOffset || chunk?.blocksOffset || { x: 0, y: 0, z: 0 };

        this.p._hash = chunk?.hash || null;
        this.p._chunk = null;
        this.p._blocks = null;

        this.inheritedChunk = chunk;
    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected access to private properties from outside of the module. This is not recommended and may cause unexpected behavior.');

        return this[_p];
    }

    set p(value) {
        console.error('(minecraft-server) ERROR: Setting private properties is not supported. Action ignored.');
    }

    get blocks() {
        if (this.p._blocks)
            return this.p._blocks;

        this.p._blocks = {};

        //copy prismarine chunk to allow new chunk to be changed without affecting the original
        if (this.inheritedChunk?.blocks)

            for (const x in this.inheritedChunk.blocks)
                for (const y in this.inheritedChunk.blocks[x])
                    for (const z in this.inheritedChunk.blocks[x][y]) {
                        if (!this.p._blocks[x])
                            this.p._blocks[x] = {};

                        if (!this.p._blocks[x][y])
                            this.p._blocks[x][y] = {};

                        this.p._blocks[x][y][z] = new Block(this.inheritedChunk.blocks[x][y][z].block, this.inheritedChunk.blocks[x][y][z].state, { x: parseInt(x) + this.blocksOffset.x, y: parseInt(y) + this.blocksOffset.y, z: parseInt(z) + this.blocksOffset.z });
                    };

        return this.p._blocks;
    }

    get chunk() {
        if (this.p._chunk)
            return this.p._chunk;

        this.p._chunk = new (PChunk())();

        for (const x in this.blocks)
            for (const y in this.blocks[x])
                for (const z in this.blocks[x][y])
                    this.p._chunk.setBlockStateId({ x, y, z }, getBlockStateId(this.blocks[x][y][z].block, this.blocks[x][y][z].state));

        return this.p._chunk;
    }

    get hash() {
        if (this.p._hash === null)
            this.p._hash = crypto.createHash('sha256').update(this.chunk.toJson()).digest('base64');

        return this.p._hash;
    }

    get chunkData() {
        if (chunkDataCache[this.hash] === undefined)
            chunkDataCache[this.hash] = {
                biomes: this.chunk.dumpBiomes?.(),
                bitMap: this.chunk.getMask(),
                chunkData: this.chunk.dump()
            };

        return chunkDataCache[this.hash];
    }

    // setBlockChecks(blockName, { x, y, z }, state = {}) {
    checkNewBlock(blockName, { x, y, z }) {
        if (blockName === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', `blockName in  ${this.constructor.name}.setBlock(blockName, ..., ...)  `, {
                got: blockName,
                expectationType: 'type',
                expectation: 'blockName'
            }, this.setBlock).toString()

        if (x < chunkSize.x.min || x > chunkSize.x.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `x in  ${this.constructor.name}.setBlock(..., {x: x, ... }, ...)  `, {
                got: x,
                expectationType: 'value',
                expectation: new Array(chunkSize.x.max - chunkSize.x.min).fill(0).map((_, i) => i + chunkSize.x.min)
            }, this.setBlock).toString()

        if (y < chunkSize.y.min || y > chunkSize.y.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `y in  ${this.constructor.name}.setBlock(..., {y: y, ... }, ...)  `, {
                got: y,
                expectationType: 'value',
                expectation: new Array(chunkSize.y.max - chunkSize.y.min).fill(0).map((_, i) => i + chunkSize.y.min)
            }, this.setBlock).toString()

        if (z < chunkSize.z.min || z > chunkSize.z.max)
            throw new CustomError('expectationNotMet', 'libraryUser', `z in  ${this.constructor.name}.setBlock(..., {z: z, ... }, ...)  `, {
                got: z,
                expectationType: 'value',
                expectation: new Array(chunkSize.z.max - chunkSize.z.min).fill(0).map((_, i) => i + chunkSize.z.min)
            }, this.setBlock).toString()
    }

    updateBlock(blockName, { x, y, z }, state = {}) {
        this.checkNewBlock(blockName, { x, y, z });

        if (this.p._chunk)
            this.chunk.setBlockStateId({ x, y, z }, getBlockStateId.call(this, blockName, state, { function: 'setBlock' }));

        if (blockName === 'air') {
            delete this.blocks[x][y][z];

            if (Object.keys(this.blocks[x][y]).length === 0)
                delete this.blocks[x][y];

            if (Object.keys(this.blocks[x]).length === 0)
                delete this.blocks[x];
        } else {
            if (!this.blocks[x])
                this.blocks[x] = {};

            if (!this.blocks[x][y])
                this.blocks[x][y] = {};

            this.blocks[x][y][z] = new Block(blockName, state, { x: x + this.blocksOffset.x, y: y + this.blocksOffset.y, z: z + this.blocksOffset.z });
        }
    }

    sendNewBlockPacket({ x, y, z }) {
        if (this.blockUpdateCallback)
            this.blockUpdateCallback(this.blocks[x]?.[y]?.[z] ?? new Block('air', {}, { x: x + this.blocksOffset.x, y: y + this.blocksOffset.y, z: z + this.blocksOffset.z }));
    }

    setBlock(blockName, { x, y, z }, state = {}) {
        this.updateBlock(blockName, { x, y, z }, state);
        this.sendNewBlockPacket({ x, y, z });

        return this;
    }
}

module.exports = Chunk;