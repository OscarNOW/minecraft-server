export class Chunk {
    private chunk: any;

    constructor();

    readonly blocks: blocksSegment;

    setBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}