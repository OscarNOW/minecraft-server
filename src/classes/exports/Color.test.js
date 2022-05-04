const { Color } = require('./Color.js');

module.exports = (expect, warn) => {
    let a = new Color('#8ed67c');

    expect(a.rgb.r, 142)
    expect(a.rgb.g, 214)
    expect(a.rgb.b, 124)
    expect(a.hex, '#8ed67c')
    expect(a.hsl, { h: 0.3, s: 0.52, l: 0.66 })

    a.rgb = {
        r: 13,
        g: 157,
        b: 186
    }

    expect(a.rgb.r, 13)
    expect(a.rgb.g, 157)
    expect(a.rgb.b, 186)
    expect(a.hex, '#0d9dba')
    expect(a.hsl, { h: 0.527, s: 0.87, l: 0.39 })

    a.rgb.g = 0;

    expect(a.rgb.r, 13)
    expect(a.rgb.g, 0)
    expect(a.rgb.b, 186)
    expect(a.hex, '#0d00ba')
    expect(a.hsl, { h: 0.67, s: 1, l: 0.36 })

    warn('Not finished')
}