import { Entity } from "./Entity";

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/ExperienceOrb
 */
export class ExperienceOrb extends Entity {
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
            experience: number;
        },
        overwrites?: {
            sendSpawnPacket?: boolean,
            beforeRemove?: (() => void)[];
        },
        whenDone?: (instance: ExperienceOrb) => void
    );
}