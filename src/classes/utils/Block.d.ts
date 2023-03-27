export class Block {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    readonly block: blockName; //todo: rename block to name
    readonly state: blockState;
    readonly stateId: number;
}

type blocksSegment = {
    [relativeX: number]: {
        [relativeY: number]: {
            [relativeZ: number]: Block;
        };
    };
};