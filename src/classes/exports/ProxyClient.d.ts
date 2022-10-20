export class ProxyClient {
    constructor();

    sendPacket(name: string, packet: object): void;
    onPacket(callback: (name: string, packet: object) => void): void;
}