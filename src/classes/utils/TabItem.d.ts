export class TabItem {
    constructor(tabItemOptions: {
        name?: string;
        displayName?: textInput | Text;
        uuid?: string;
        skinAccountUuid?: string;
        gamemode?: gamemode;
        ping?: number | null;
    })

    readonly name: string;
    displayName?: Text;

    readonly uuid: string;
    readonly skinAccountUuid?: string;

    gamemode: gamemode;
    ping: number | null;
}