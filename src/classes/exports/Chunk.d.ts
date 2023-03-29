type blocksSegment = import('../utils/Block').blocksSegment;

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

    updateBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;

    //todo: add overwrite where you can pass a Block class
    setBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}