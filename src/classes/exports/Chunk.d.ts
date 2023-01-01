export class Chunk {
    private chunk: unknown;

    constructor();

    readonly blocks: blocksSegment;
    readonly hash: string;
    private readonly chunkData: {
        biomes: unknown,
        bitMap: unknown,
        chunkData: unknown
    };

    setBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}