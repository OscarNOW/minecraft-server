export class TabItem {
    constructor(tabItemOptions: {
        name?: string;
        displayName?: textInput | Text;
        uuid?: string;
        skinAccountUuid?: string;
        gamemode?: gamemode;
        ping?: number | null;
    }, client: Client, sendPacket: (packetName: string, packet: object) => void, finishedCallback: () => void);

    readonly client: Client;
    readonly server: Server;

    readonly name: string; //todo: make writable by sending packets to remove old TabItem and add new one (with same class instance)
    displayName?: Text;

    readonly uuid: string; //todo: make writable by sending packets to remove old TabItem and add new one (with same class instance)
    readonly skinAccountUuid?: string; //todo: make writable by sending packets to remove old TabItem and add new one (with same class instance)

    gamemode: gamemode;
    ping: number | null;
}