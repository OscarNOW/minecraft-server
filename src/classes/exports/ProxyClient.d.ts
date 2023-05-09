/**
 * @description Create a fake Client that can connect to a server where you can control the packets sent and received.
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/ProxyClient
 */
export class ProxyClient {
    constructor(information?: {
        latency?: number;
        username?: string;
        uuid?: string;
        ip?: string;
        host?: string;
        port?: number;
        skinTextureUrl?: string;
        capeTextureUrl?: string;
    });

    latency: number;

    end(): void;
    sendPacket(name: string, packet: object): void;
    onPacket(callback: (name: string, packet: object) => void): void;
    removeAllListeners(): void;
}