export class Player extends Entity {
    constructor(client: Client, type: entityName, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw?: number;
        pitch?: number;
    }, sendPacket: (packetName: string, packet: object) => void, playerInfo: TabItem);
}