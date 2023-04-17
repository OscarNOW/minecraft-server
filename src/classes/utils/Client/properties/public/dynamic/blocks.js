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
            if (!this.p.blocksGenerated) {
                this.p._blocks = generateBlocks.call(this);
                this.p.blocksGenerated = true;
            }

            const oldBlocks = deepCopyBlocksSegment(this.blocks);

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
    let blocks = {};

    for (const chunk of this.chunks)
        for (const relativeX in chunk.blocks) {
            const x = chunk.x * (chunkSize.x.max - chunkSize.x.min) + relativeX;
            blocks[x] = {};

            for (const y in chunk.blocks[relativeX]) {
                blocks[x][y] = {};

                for (const relativeZ in chunk.blocks[relativeX][y]) {
                    const z = chunk.z * (chunkSize.z.max - chunkSize.z.min) + relativeZ;

                    blocks[x][y][z] = chunk.blocks[relativeX][y][relativeZ];
                }
            }
        }

    return blocks;
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