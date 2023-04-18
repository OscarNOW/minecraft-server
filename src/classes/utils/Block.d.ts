
/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Block
 */
export class Block {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    readonly block: blockName; //todo: rename block to name
    readonly state: blockState;
    readonly stateId: number;
}

type relativeBlocksSegment = {
    [relativeX: number]: {
        [relativeY: number]: {
            [relativeZ: number]: Block;
        };
    };
};