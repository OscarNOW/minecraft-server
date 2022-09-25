export class Chunk {
    private chunk: any;
    constructor();
    setBlock(block: blockType, location: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}