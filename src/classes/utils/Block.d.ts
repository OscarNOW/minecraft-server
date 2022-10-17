export class Block {
    private readonly stateId: number;

    readonly x: number;
    readonly y: number;
    readonly z: number;

    readonly block: blockName;
    readonly state: blockState;
}

type blocksSegment = {
    [x: number]: {
        [y: number]: {
            [z: number]: Block;
        };
    };
};