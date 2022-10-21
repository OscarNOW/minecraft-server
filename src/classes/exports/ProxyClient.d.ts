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