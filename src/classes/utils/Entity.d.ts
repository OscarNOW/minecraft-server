type Client = import('./Client').Client;

export class Entity {
    private constructor(client: Client, type: entityType, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw?: number;
        pitch?: number;
    }, sendPacket: (packetName: string, packet: object) => void);

    readonly id: number;
    readonly uuid: string;
    readonly client: Client;
    readonly type: entityType;
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

    observe(observable: 'position', callback: (position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }) => void): void;

    on(event: 'leftClick', callback: () => void): void;
    on(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;
}