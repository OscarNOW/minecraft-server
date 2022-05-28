const { ChangableRgb } = require('../utils/ChangableRgb.js');
const { ChangableHsl } = require('../utils/ChangableHsl.js');

class Color {
    constructor(input) {
        let rgb;

        if (typeof input == 'string')
            if (input.startsWith('#'))
                rgb = Color.hexToRgb(input)
            else
                throw new Error(`Unknown Color input "${input}" (${typeof input}). If you want to use hex, please start the string with "#"`)
        else if (input.r && input.g && input.b)
            rgb = {
                r: input.r,
                g: input.g,
                b: input.b
            }
        else if (input.h && input.s && input.l)
            rgb = Color.hslToRgb(input)
        else
            throw new Error(`Unknown Color input "${input}" (${typeof input})`)

        this._rgb = new ChangableRgb(rgb => {
            this.rgb = rgb;
        }, rgb);

        this._hsl = new ChangableHsl(hsl => {
            this.hsl = hsl;
        }, Color.rgbToHsl(rgb))

        this.hex = Color.rgbToHex(rgb)
    }

    set rgb(rgb) {
        this._rgb._ = rgb;
        this._hsl._ = Color.rgbToHsl(this._rgb)
        this._hex = Color.rgbToHex(this._rgb)
    }

    set hsl(hsl) {
        this._hsl._ = hsl;
        this._rgb._ = Color.hslToRgb(this._hsl)
        this._hex = Color.rgbToHex(this._rgb)
    }

    set hex(hex) {
        this._hex = hex;
        this._rgb._ = Color.hexToRgb(this._hex)
        this._hsl._ = Color.rgbToHsl(this._rgb)
    }

    get hsl() {
        return this._hsl;
    }

    get hex() {
        return this._hex;
    }

    get rgb() {
        return this._rgb;
    }

    //rgb: 0 - 255
    //hsl: 0 - 1
    static rgbToHsl({ r, g, b }) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min)
            h = s = 0;
        else {
            const d = max - min;

            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h, s, l };
    }

    //hsl: 0 - 1
    //rgb: 0 - 255
    static hslToRgb({ h, s, l }) {
        var r, g, b;

        if (s == 0)
            r = g = b = l;
        else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    //rgb: 0 - 255
    static rgbToHex({ r, g, b }) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    //rgb: 0 - 255
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
        }
        return null;
    }
}

module.exports = Object.freeze({ Color });