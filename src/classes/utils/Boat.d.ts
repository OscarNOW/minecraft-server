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

}