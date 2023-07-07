
/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Block
 */
export class Block {
    /**
     * The absolute x of the block, relative to the world and not to the chunk.
     */
    readonly x: number;
    readonly y: number;
    /**
     * The absolute z of the block, relative to the world and not to the chunk.
     */
    readonly z: number;

    readonly block: blockName; //todo: rename block to name
    readonly state: blockState;
    readonly stateId: number;

    //todo: add types for property p
}

type relativeBlocksSegment = {
    [relativeX: number]: {
        [relativeY: number]: {
            [relativeZ: number]: Block;
        };
    };
};