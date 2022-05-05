export class ChangablePosition {
    constructor(onChange: (newPosition: position) => void, startPosition: position);
    private _: position;
    private _onChange: (newPosition: position) => void;

    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
}

type position = {
    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
}