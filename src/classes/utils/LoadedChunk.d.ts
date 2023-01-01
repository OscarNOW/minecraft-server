type Client = import('./Client').Client;

import { Chunk } from "../exports/Chunk";
type Server = import('../exports/Server').Server;

export class LoadedChunk extends Chunk {
    private constructor(client: Client, pChunk: unknown, chunkPosition: { x: number; z: number });
    private sendPacket(name: string, contents: object): void;

    readonly client: Client;
    readonly server: Server;

    x: number;
    z: number;

    remove(): void;
}