export class Chunk {
    private chunk: any;

    constructor();

    readonly blocks: blocksSegment;
    readonly hash: string;
    private readonly chunkData: {
        biomes: any,
        bitMap: any,
        chunkData: any
    }

    setBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}