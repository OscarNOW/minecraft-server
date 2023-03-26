type Horse = import('./Horse').Horse;
type Player = import('./Player').Player;
type ExperienceOrb = import('./ExperienceOrb').ExperienceOrb;

type Client = import('./Client').Client;

type Server = import('../exports/Server').Server;
type Text = import('../exports/Text').Text;
type textInput = import('../exports/Text').textInput;

type EntityLike = Entity | Horse;
type EntityConditional<name extends entityName> =
    name extends 'horse' ? Horse :
    name extends 'player' ? Player :
    name extends 'experience_orb' ? ExperienceOrb :
    Entity;

export class Entity {
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
        extraInfo?: undefined,
        overwrites?: {
            sendSpawnPacket?: boolean,
            beforeRemove?: (() => void)[];
        },
        whenDone?: (instance: Entity) => void
    );

    readonly client: Client;
    readonly server: Server;
    readonly id: number;
    readonly uuid: string;
    readonly type: entityName;
    readonly living: boolean;

    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    };

    camera(): void;
    animation(animationType: entityAnimationType): void;
    sound(soundInfo: {
        sound: soundName;
        channel: soundChannel;
        volume: number;
        pitch: number;
    }): void;
    remove(): void;
    killClient(deathMessage: textInput | Text): void;

    observe(observable: 'position', callback: (position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }) => void): void;

    removeAllListeners(event?: 'leftClick' | 'rightClick'): void;

    on(event: 'leftClick', callback: () => void): void;
    on(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;

    once(event: 'leftClick', callback: () => void): void;
    once(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;
}