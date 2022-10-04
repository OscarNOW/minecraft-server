export class BossBar {
    constructor(client: Client, sendPacket: (packetName: string, packet: object) => void, bossBarInfo?: optionalBossBarInfo);

    title: Text;
    health: number;
    color: bossBarColorName;
    divisionAmount: bossBarDivisionAmount;
    flags: bossBarFlags;

    readonly id: string;
    readonly client: Client;
    readonly server: Server;

    remove(): void;
}

type optionalBossBarInfo = {
    title?: textInput | Text;
    health?: number;
    color?: bossBarColorName;
    divisionAmount?: bossBarDivisionAmount;
    flags?: bossBarFlags;
};

type bossBarDivisionAmount = 0 | 6 | 10 | 12 | 20;
type bossBarFlags = {
    darkenSky: boolean;
    playEndMusic: boolean;
    createFog: boolean;
};