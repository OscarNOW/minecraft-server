type Client = import('./Client').Client;

import { Chunk } from "../exports/Chunk";
type Server = import('../exports/Server').Server;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/LoadedChunk
 */
export class LoadedChunk extends Chunk {
    /**
     * @package
     */
    constructor(client: Client, pChunk: unknown, chunkPosition: { x: number; z: number });
    /**
     * @package
     */
    sendPacket(name: string, contents: object): void;
    /**
     * @package
     */
    readonly blocksX: number[];

    readonly client: Client;
    readonly server: Server;

    x: number;
    z: number;

    remove(): void;
}