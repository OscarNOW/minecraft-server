export class Block {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    block: blockType;
    state: blockState;
}

type blocksSegment = {
    [x: number]: {
        [y: number]: {
            [z: number]: Block;
        };
    };
};