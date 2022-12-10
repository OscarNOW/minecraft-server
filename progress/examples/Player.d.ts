export class Player extends Entity {
    constructor(client: Client, type: entityName, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw?: number;
        pitch?: number;
    }, sendPacket: (packetName: string, packet: object) => void, playerInfo: TabItem | optionalPlayerInfo);

    playerInfo: TabItem | playerInfo;
}

type optionalPlayerInfo = {
    name?: string;
    displayName?: textInput | Text;
    uuid?: string;
    skinAccountUuid?: string;
    gamemode?: gamemode;
    ping?: number | null;
};

type playerInfo = {
    readonly name: string;
    displayName?: Text;
    readonly uuid: string;
    readonly skinAccountUuid?: string;
    gamemode: gamemode;
    ping: number | null;
};