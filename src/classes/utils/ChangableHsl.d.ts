export class ChangableHsl {
    constructor(onChange: (newHsl: hsl) => void, startHsl: hsl);
    private _: hsl;
    private _onChange: (newHsl: hsl) => void;

    h: number;
    s: number;
    l: number;
}

type hsl = {
    h: number;
    s: number;
    l: number;
}