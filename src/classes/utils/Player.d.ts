import { Entity } from "./Entity";
type Client = import('./Client').Client;
type TabItem = import('./TabItem').TabItem;
type entityName = import('../../types').entityName;
type gamemode = import('../../types').gamemode;
type textInput = import('../exports/Text').textInput;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Player
 */
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
        whenDone?: (instance: Player) => void
    );

    readonly tabItem: TabItem; //todo: make writable

    uuid: string;
    get name(): Text;
    set name(name: textInput | Text);
    gamemode: gamemode;
}