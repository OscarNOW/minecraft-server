export class TabItem {
    constructor(tabItemOptions: {
        name?: textInput | Text;
        uuid?: string;
        ping?: number | null;
    }, client: Client, sendPacket: (packetName: string, packet: object) => void, finishedCallback: () => void);

    readonly client: Client;
    readonly server: Server;

    readonly name: Text; //todo: make writable by sending packets to remove old TabItem and add new one (with same class instance)
    readonly uuid: string; //todo: make writable by sending packets to remove old TabItem and add new one (with same class instance)
    ping: number | null;
}