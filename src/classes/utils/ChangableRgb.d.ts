export class ChangableRgb {
    constructor(onChange: (newRgb: rgb) => void, startRgb: rgb);
    private _: rgb;
    private _onChange: (newRgb: rgb) => void;

    r: number;
    g: number;
    b: number;
}

type rgb = {
    r: number;
    g: number;
    b: number;
};