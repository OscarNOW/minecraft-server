export class TabItem {
    constructor(tabItemOptions: {
        name?: textInput | Text;
        uuid?: string;
        ping?: number | null;
    }, client: Client, sendPacket: (packetName: string, packet: object) => void, finishedCallback: () => void);

    readonly client: Client;
    readonly server: Server;

    readonly player?: Player; //todo: make changable

    uuid: string;
    name: Text;
    ping: number | null;

    remove(): void;
}