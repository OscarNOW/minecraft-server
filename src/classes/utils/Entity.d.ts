import { EventEmitter } from 'events';

type Client = import('./Client').Client;

export class Entity extends EventEmitter {
    private constructor(client: Client, type: entityType, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }, sendPacket: (packetName: string, packet: object) => void);

    readonly id: number;
    readonly client: Client;
    readonly type: entityType;
    readonly living: boolean;

    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }

    camera(): void;
    animation(animationType: entityAnimationType): void;
    sound(soundInfo: {
        sound: soundName;
        channel: soundChannel;
        volume: number;
        pitch: number;
    }): void;

    on(event: 'leftClick', callback: () => void): void;
    on(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    addListener(event: 'leftClick', callback: () => void): void;
    addListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    once(event: 'leftClick', callback: () => void): void;
    once(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    prependListener(event: 'leftClick', callback: () => void): void;
    prependListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    prependOnceListener(event: 'leftClick', callback: () => void): void;
    prependOnceListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    off(event: 'leftClick', callback: () => void): void;
    off(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    removeListener(event: 'leftClick', callback: () => void): void;
    removeListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    rawListeners(event: 'leftClick'): (() => void)[];
    rawListeners(event: 'rightClick'): ((
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void)[];

    removeAllListeners(event?: 'leftClick' | 'rightClick'): void;
}