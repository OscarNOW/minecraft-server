export class ChangablePosition {
    constructor(onChange: (position: position) => void, position: position);
    onChange: (position: position) => void;
    raw: position;
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