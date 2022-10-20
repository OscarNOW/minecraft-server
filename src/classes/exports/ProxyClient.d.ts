export class ProxyClient {
    constructor(information?: {
        latency?: number;
    });

    latency: number;

    sendPacket(name: string, packet: object): void;
    onPacket(callback: (name: string, packet: object) => void): void;
}