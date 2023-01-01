type Chunk = import('../exports/Chunk').Chunk;

export class LoadedChunk extends Chunk {
    private constructor(client: Client, pChunk: unknown, chunkPosition: { x: number; z: number });
    private sendPacket(name: string, contents: object): void;

    client: Client;
    server: Server;

    x: number;
    z: number;

    remove(): void;
}