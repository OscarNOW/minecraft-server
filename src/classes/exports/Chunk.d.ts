export class Chunk {
    private chunk: any;
    private isLoadedChunk: boolean;

    constructor();
    setBlock(block: blockType, location: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
}