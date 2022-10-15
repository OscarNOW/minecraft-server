type Chunk = import('../exports/Chunk').Chunk;

export class LoadedChunk extends Chunk {
    private constructor(client: Client, pChunk: any, chunkPosition: { x: number; z: number });

    client: Client;
    server: Server;

    x: number;
    z: number;
}