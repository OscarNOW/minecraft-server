export class TabItem {
    constructor(tabItemOptions: {
        name?: textInput | Text;
        uuid?: string;
        ping?: number | null;
    }, client: Client, sendPacket: (packetName: string, packet: object) => void, finishedCallback: () => void);

    readonly client: Client;
    readonly server: Server;

    readonly name: Text; //todo: make writable by using <TabItem>.p.respawn()
    readonly uuid: string; //todo: make writable by using <TabItem>.p.respawn()
    ping: number | null;
}