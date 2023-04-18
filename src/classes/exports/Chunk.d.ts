type relativeBlocksSegment = import('../utils/Block').relativeBlocksSegment;

type blockName = import('../../types').blockName;
type blockState = import('../../types').blockState;

export class Chunk {
    private chunk: unknown;

    constructor();

    /**
     * The blocks in the chunk relative to the chunk.
     */
    readonly blocks: relativeBlocksSegment;
    readonly hash: string;
    private readonly chunkData: {
        biomes: unknown,
        bitMap: unknown,
        chunkData: unknown
    };

    //todo: add overwrite where you can pass a Block class
    /**
     * Set a block without sending a packet to the client.
     * @param chunkRelativeLocation The location relative to the chunk. Must be between 0 and 15.
     */
    updateBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;

    //todo: add overwrite where you can pass a Block class
    /**
     * @param chunkRelativeLocation The location relative to the chunk. Must be between 0 and 15.
     */
    setBlock(block: blockName, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}