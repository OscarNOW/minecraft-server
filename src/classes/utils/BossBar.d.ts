export class BossBar {
    constructor(client: Client, sendPacket: (packetName: string, packet: object) => void, bossBarInfo?: {
        title?: textInput | Text;
        health?: number;
        color?: bossBarColor;
        divisionAmount?: bossBarDivision;
        flags?: bossBarFlags;
    });

    title: Text;
    health: number;
    color: bossBarColor;
    divisionAmount: bossBarDivision;
    flags: bossBarFlags;

    readonly id: string;
    readonly client: Client;

    remove(): void;
}