const { Changable } = require('../utils/Changable.js');
const { CustomError } = require('../utils/CustomError.js');

class Color {
    constructor(input, i2, i3) {
        this._rgbCached = false;
        this._hslCached = false;
        this._hexCached = false;

        let rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        let hsl = {
            h: 0,
            s: 0,
            l: 0
        };
        let hex = '#000000';

        if ((i2 !== undefined) && (i3 !== undefined)) {
            this._rgbCached = true;
            rgb = {
                r: input,
                g: i2,
                b: i3
            }
        } else if (typeof input == 'string')
            if (input.startsWith('#')) {
                this._hexCached = true;
                hex = input
            } else
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'input', ''],
                    ['in the ', 'constructor', ' of'],
                    ['the class ', this.constructor.name, ''],
                ], {
                    got: input,
                    expectationType: 'type',
                    expectation: 'string | rgb | hsl',
                    externalLink: '{docs}/classes/Color.html#constructor'
                }, this.constructor).toString()
        else if (input.r && input.g && input.b) {
            this._rgbCached = true;
            rgb = {
                r: input.r,
                g: input.g,
                b: input.b
            }
        } else if (input.h && input.s && input.l) {
            this._hslCached = true;
            hsl = input;
        } else
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'input', ''],
                ['in the ', 'constructor', ' of'],
                ['the class ', this.constructor.name, ''],
            ], {
                got: input,
                expectationType: 'type',
                expectation: 'string | rgb | hsl',
                externalLink: '{docs}/classes/Color.html#constructor'
            }, this.constructor).toString()

        this._rgb = new Changable(rgb => {
            this.rgb = rgb;
        }, rgb);

        this._hsl = new Changable(hsl => {
            this.hsl = hsl;
        }, hsl)

        this._hex = hex;
    }

    set rgb(rgb) {
        this._rgb.setRaw(rgb);

        this._rgbCached = true;
        this._hslCached = false;
        this._hexCached = false;
    }

    set hsl(hsl) {
        this._hsl.setRaw(hsl);

        this._rgbCached = false;
        this._hslCached = true;
        this._hexCached = false;
    }

    set hex(hex) {
        this._hex = hex;

        this._rgbCached = false;
        this._hslCached = false;
        this._hexCached = true;
    }

    get hsl() {
        if (!this._hslCached)
            this._hsl.setRaw(Color.rgbToHsl(this.rgb))

        this._hslCached = true
        return this._hsl;
    }

    get hex() {
        if (!this._hexCached)
            this.hex = Color.rgbToHex(this.rgb)

        this._hexCached = true
        return this._hex;
    }

    get rgb() {
        if (!this._rgbCached)
            if (this._hexCached)
                this._rgb.setRaw(Color.hexToRgb(this.hex))
            else
                this._rgb.setRaw(Color.hslToRgb(this.hsl))

        this._rgbCached = true
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

module.exports = Color;