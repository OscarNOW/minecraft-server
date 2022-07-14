export class Chunk {
    private chunk: any;
    constructor();
    setBlock(location: {
        x: number;
        y: number;
        z: number;
    }, block: blockType, state?: blockState): this;
}