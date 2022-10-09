type Chunk = import('../exports/Chunk').Chunk;

export class LoadedChunk extends Chunk {
    private constructor(client: Client, pChunk: any, chunkPosition: { x: number; z: number });
    private updateBlock(block: blockType, chunkRelativeLocation: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): void;

    client: Client;
    server: Server;

    x: number;
    z: number;
}