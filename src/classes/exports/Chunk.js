const prismarineChunk = require('prismarine-chunk')(version);
const Vec3 = require('vec3');
const blocks = require('../../data/blocks.json');

class Chunk {
    constructor() {
        this.chunk = new prismarineChunk();

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this.chunk.setSkyLight(new Vec3(x, y, z), 15)
    }

    setBlock(block, { x, y, z }) {
        let blockId = getBlockId(block);
        if (blockId === null) throw new Error(`Unknown block "${block}"`);

        this.chunk.setBlockType(new Vec3(x, y, z), blockId);
        this.chunk.setBlockData(new Vec3(x, y, z), 1);

        return this;
    }
}

function getBlockId(blockName) {
    if (typeof blocks[blockName] == 'number')
        return blocks[blockName]

    if (typeof blocks[blockName] == 'string')
        return getBlockId(blocks[blockName])

    if (blocks[blockName] === null)
        return null;

    return undefined;
}

module.exports = { Chunk };