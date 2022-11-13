type Entity = import('./Entity').Entity;

export class Boat extends Entity {

    removeAllListeners(event?: 'steer' | 'leftClick' | 'rightClick'): void;

    on(event: 'steer', callback: (steerInfo: {
        left: boolean;
        right: boolean;
    }) => void): void;

    once(event: 'steer', callback: (steerInfo: {
        left: boolean;
        right: boolean;
    }) => void): void;

    //inherited by Entity
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