export class Color {
    constructor(color: hex | rgb | hsl);

    hex: hex;
    rgb: rgb;
    hsl: hsl;

    static rgbToHsl(rgb: rgb): hsl;
    static hslToRgb(hsl: hsl): rgb;
    static rgbToHex(rgb: rgb): hex;
    static hexToRgb(hex: hex): rgb;
}

type hex = string;

type rgb = {
    r: number;
    g: number;
    b: number;
};

type hsl = {
    h: number;
    s: number;
    l: number;
};