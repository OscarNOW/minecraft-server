export class ChangablePosition {
    constructor(onChange: (position: position) => void, position: position);
    private _: position;
    private _onChange: (position: position) => void;

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