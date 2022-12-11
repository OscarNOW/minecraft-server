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
        extraInfo: {
            tabItem?: TabItem;
            name?: string;
            uuid?: string;
            gamemode?: gamemode;
        }
    );

    tabItem?: TabItem;

    readonly uuid: string; //todo: make changable
    readonly name: string; //todo: make changable
    gamemode: gamemode;
}