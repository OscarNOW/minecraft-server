type relativeBlocksSegment = import('../utils/Block').relativeBlocksSegment;

type blockName = import('../../types').blockName;
type blockState = import('../../types').blockState;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Chunk *
 */
export class Chunk {
    constructor();

    /**
     * The blocks in the chunk relative to the chunk.
    */
    readonly blocks: relativeBlocksSegment;
    readonly hash: string;

    /**
     * @package
     */
    readonly chunk: unknown;
    /**
     * @package
     */
    readonly chunkData: {
        biomes: unknown,
        bitMap: unknown,
        chunkData: unknown
    };

    //todo: add overwrite where you can pass a Block class
    /**
     * Set a block without sending a packet to the client.
     * @param chunkRelativeLocation The location relative to the chunk. Must be between 0 and 15.
     * @package
     */
    updateBlock<currentBlockName extends blockName>(
        blockName: currentBlockName,
        chunkRelativeLocation: {
            x: number;
            y: number;
            z: number;
        },
        blockState: blockState<currentBlockName>
    ): this;

    //todo: add overwrite where you can pass a Block class
    /**
     * @param chunkRelativeLocation The location relative to the chunk. Must be between 0 and 15.
     * @example
     *          for (let x = 0; x < 16; x++)
     *              for (let z = 0; z < 16; z++)
     *                  for (let y = 0; y < 100; y++)
     *                      chunk.setBlock('grass_block', { x, y, z }, { snowy: false });
     *
     */
    setBlock<currentBlockName extends blockName>(
        blockName: currentBlockName,
        chunkRelativeLocation: {
            x: number;
            y: number;
            z: number;
        },
        blockState: blockState<currentBlockName>
    ): this;

    //todo: add types for property p
}