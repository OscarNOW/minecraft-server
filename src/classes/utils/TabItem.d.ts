type Client = import('./Client').Client;
type Player = import('./Player').Player;

type Server = import('../exports/Server').Server;
type Text = import('../exports/Text').Text;
type textInput = import('../exports/Text').textInput;

type gamemode = import('../../types').gamemode;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/TabItem
 */
export class TabItem {
    constructor(
        tabItemOptions: {
            player?: Player;
            name?: textInput | Text;
            uuid?: string;
            skinAccountUuid?: string;
            ping?: number | null;
        },
        client: Client,
        sendPacket: (packetName: string, packet: object) => void,
        finishedCallback: () => void,
        { sendSpawnPacket }: { sendSpawnPacket: boolean }
    );

    readonly client: Client;
    readonly server: Server;

    readonly player?: Player; //todo: make writable
    readonly gamemode: gamemode;

    uuid: string;
    skinAccountUuid?: string;
    get name(): Text;
    set name(name: textInput | Text);
    ping: number | null;

    //todo: implement on('change')

    remove(): void;
}