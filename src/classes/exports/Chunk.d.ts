export class Chunk {
    private chunk: any;

    constructor();

    blocks: blocksSegment;

    setBlock(block: blockName, location: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}