export class Block {
    private readonly stateId: number;

    readonly x: number;
    readonly y: number;
    readonly z: number;

    block: blockName;
    state: blockState;
}

type blocksSegment = {
    [x: number]: {
        [y: number]: {
            [z: number]: Block;
        };
    };
};