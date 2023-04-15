type relativeBlocksSegment = import('../utils/Block').relativeBlocksSegment;

export class Chunk {
    private chunk: unknown;

    constructor();

    readonly blocks: relativeBlocksSegment;
    readonly hash: string;
    private readonly chunkData: {
        biomes: unknown,
        bitMap: unknown,
        chunkData: unknown
    };

    //todo: add overwrite where you can pass a Block class
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