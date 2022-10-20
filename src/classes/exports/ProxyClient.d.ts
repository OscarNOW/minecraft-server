export class ProxyClient {
    constructor(information?: {
        latency?: number;
        username?: string;
        uuid?: string;
    });

    latency: number;

    sendPacket(name: string, packet: object): void;
    onPacket(callback: (name: string, packet: object) => void): void;
}