export class BossBar {
    constructor(client: Client, sendPacket: (packetName: string, packet: object) => void, bossBarInfo?: optionalBossBarInfo);

    get title(): Text;
    set title(title: textInput | Text);
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

type bossBarFlags = {
    darkenSky: boolean;
    playEndMusic: boolean;
    createFog: boolean;
};