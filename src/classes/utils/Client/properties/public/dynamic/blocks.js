const { chunkSize } = require('../../../../../../functions/loader/data.js');

module.exports = {
    blocks: {
        get() {
            if (!this.p.blocksGenerated) {
                this.p._blocks = generateBlocks.call(this);
                this.p.blocksGenerated = true;
            }

            return this.p._blocks;
        },
        setBlocks(blocks) {
            const oldBlocks = deepCopyBlocksSegment(this.blocks); //this.blocks will generate blocks if not already generated

            for (const x in blocks) {
                if (!this.blocks[x])
                    this.blocks[x] = {};

                for (const y in blocks[x]) {
                    if (!this.blocks[x][y])
                        this.blocks[x][y] = {};

                    for (const z in blocks[x][y])
                        this.blocks[x][y][z] = blocks[x][y][z];
                }
            }

            const changed = !compareBlocksSegment(oldBlocks, this.blocks);
            if (changed)
                this.p.emitChange('blocks', oldBlocks)
        },
        init() {
            this.blocksGenerated = false;
            this.p._blocks = () => ({});
            this.p.onFirstChangeEventListener('blocks', () => {
                if (!this.blocksGenerated) {
                    this.p._blocks = generateBlocks.call(this);
                    this.blocksGenerated = true;
                }
            });
        }
    }
}

function generateBlocks() {
    return getLazyBlocksX.call(this);
}

function getLazyBlocksX() {
    const blocks = {};
    const blocksX = getBlocksX.call(this);

    for (const blockX of blocksX)
        Object.defineProperty(blocks, blockX, {
            configurable: false,
            enumerable: true,
            get: () => getLazyBlocksY.call(this, blockX)
        })

    return blocks;
}

function getLazyBlocksY(x) {
    const blocks = {};
    const blocksY = getBlocksY.call(this, x);

    for (const blockY of blocksY)
        Object.defineProperty(blocks, blockY, {
            configurable: false,
            enumerable: true,
            get: () => getLazyBlocksZ.call(this, x, blockY)
        })

    return blocks;
}

function getLazyBlocksZ(x, y) {
    const blocks = {};
    const blocksZ = getBlocksZ.call(this, x, y);

    for (const blockZ of blocksZ)
        Object.defineProperty(blocks, blockZ, {
            configurable: false,
            enumerable: true,
            get: () => getSpecificBlock.call(this, x, y, blockZ)
        })

    return blocks;
}

function getBlocksX() {
    let blocksX = [];

    for (const chunk of this.chunks)
        for (const blockX of chunk.blocksX)
            if (!blocksX.includes(blockX))
                blocksX.push(blockX);

    return blocksX;
}

function getBlocksY(x) {
    let blocksY = [];

    for (const chunk of this.chunks) {
        const relativeX = x - chunk.x * (chunkSize.x.max - chunkSize.x.min);
        if (!chunk.blocks[relativeX]) continue;

        for (let relativeY in chunk.blocks[relativeX]) {
            relativeY = parseInt(relativeY);
            const y = relativeY;
            if (!blocksY.includes(y)) blocksY.push(y);
        }
    }

    return blocksY;
}

function getBlocksZ(x, y) {
    let blocksZ = [];

    for (const chunk of this.chunks) {
        const relativeX = x - chunk.x * (chunkSize.x.max - chunkSize.x.min);
        if (!chunk.blocks[relativeX]) continue;

        const relativeY = y;
        if (!chunk.blocks[relativeX][relativeY]) continue;

        for (let relativeZ in chunk.blocks[relativeX][relativeY]) {
            relativeZ = parseInt(relativeZ);
            const z = chunk.z * (chunkSize.z.max - chunkSize.z.min) + relativeZ;
            if (!blocksZ.includes(z)) blocksZ.push(z);
        }
    }

    return blocksZ;
}

function getSpecificBlock(x, y, z) {
    const chunkX = Math.floor(x / 16);
    const chunkZ = Math.floor(z / 16);

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);

    let chunkRelativeX = x % (chunkSize.x.max - chunkSize.x.min);
    let chunkRelativeY = y % (chunkSize.y.max - chunkSize.y.min);
    let chunkRelativeZ = z % (chunkSize.z.max - chunkSize.z.min);

    if (chunkRelativeX < 0) chunkRelativeX += 16;
    if (chunkRelativeY < 0) chunkRelativeY += 16;
    if (chunkRelativeZ < 0) chunkRelativeZ += 16;

    const block = chunk.blocks[chunkRelativeX][chunkRelativeY][chunkRelativeZ];

    return block;
}

function deepCopyBlocksSegment(blocksSegment) {
    let out = {};

    for (let x in blocksSegment) {
        out[x] = {};

        for (let y in blocksSegment[x]) {
            out[x][y] = {};

            for (let z in blocksSegment[x][y])
                out[x][y][z] = blocksSegment[x][y][z];
        };
    };

    return out;
};

//function to check if two blocksSegments are equal
function compareBlocksSegment(blocksSegment1, blocksSegment2) {
    if (!blocksSegment1) return false;

    if (!blocksSegment2) return false
    if (Object.keys(blocksSegment1).length !== Object.keys(blocksSegment2).length) return false;

    for (let x in blocksSegment1) {
        if (!blocksSegment2[x]) return false;
        if (Object.keys(blocksSegment1[x]).length !== Object.keys(blocksSegment2[x]).length) return false;

        for (let y in blocksSegment1[x]) {
            if (!blocksSegment2[x][y]) return false;
            if (Object.keys(blocksSegment1[x][y]).length !== Object.keys(blocksSegment2[x][y]).length) return false;

            for (let z in blocksSegment1[x][y])
                if (!compareBlocks(blocksSegment1[x][y][z], blocksSegment2[x][y][z]))
                    return false;
        };
    };

    return true;
}

function compareBlocks(block1, block2) {
    return block1 === block2;
}