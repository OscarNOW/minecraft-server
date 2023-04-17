//todo: add to changelog

module.exports = {
    blocks: {
        info: {
            preventSet: true
        },
        get() {
            if (!this.p.blocksGenerated) {
                this.p._blocks = this.p._blocks();
                this.p.blocksGenerated = true;
            }

            return this.p._blocks;
        },
        set(value) {
            let oldValue;
            let changed;

            //todo: check if blocks are generated and if not, generate them by calling value function

            //only compute changed and oldValue if there are change listeners for blocks
            if (this.p.changeEventHasListeners('blocks')) {
                oldValue = deepCopyBlocksSegment(this.blocks); //generates blocks if not already generated
                changed = compareBlocksSegment(oldValue, value);
            };

            this.p._blocks = value;

            if (this.p.changeEventHasListeners('blocks') && changed)
                this.p.emitChange('blocks', oldValue);
        },
        init() {
            this.blocksGenerated = false;
            this.p._blocks = () => ({});
            this.p.onFirstChangeEventListener('blocks', () => {
                if (!this.blocksGenerated) {
                    this.p._blocks = this.p._blocks();
                    this.blocksGenerated = true;
                }
            });
        }
    }
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