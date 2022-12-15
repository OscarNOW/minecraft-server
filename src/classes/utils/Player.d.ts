//todo: code not yet implemented

export class Player extends Entity {
    constructor(
        client: Client,
        type: entityName,
        id: number,
        position: {
            x: number;
            y: number;
            z: number;
            yaw?: number;
            pitch?: number;
        },
        sendPacket: (packetName: string, packet: object) => void,
        extraInfo?: {
            tabItem?: TabItem;
            name?: string;
            uuid?: string;
            gamemode?: gamemode;
        },
        overwrites?: undefined,
        whenDone?: (instance: this) => void
    );

    readonly tabItem?: TabItem; //todo: make changable

    uuid: string;
    name: string;
    gamemode: gamemode;
}