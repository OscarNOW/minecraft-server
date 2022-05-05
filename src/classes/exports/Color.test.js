const { Color } = require('./Color.js');

module.exports = (expect, warn) => {
    let a = new Color('#8ed67c');

    expect(a.rgb.r, 142)
    expect(a.rgb.g, 214)
    expect(a.rgb.b, 124)
    expect(a.hex, '#8ed67c')
    expect(a.hsl.h, 0.3)
    expect(a.hsl.s, 0.5232558139534885)
    expect(a.hsl.l, 0.6627450980392157)

    a.rgb = {
        r: 13,
        g: 157,
        b: 186
    }

    expect(a.rgb.r, 13)
    expect(a.rgb.g, 157)
    expect(a.rgb.b, 186)
    expect(a.hex, '#0d9dba')
    expect(a.hsl.h, 0.5279383429672447)
    expect(a.hsl.s, 0.8693467336683416)
    expect(a.hsl.l, 0.39019607843137255)

    a.rgb.g = 0;

    expect(a.rgb.r, 13)
    expect(a.rgb.g, 0)
    expect(a.rgb.b, 186)
    expect(a.hex, '#0d00ba')
    expect(a.hsl.h, 0.67831541218638)
    expect(a.hsl.s, 1)
    expect(a.hsl.l, 0.36470588235294116)

    a = new Color({
        r: 16,
        g: 166,
        b: 166
    });

    expect(a.rgb.r, 16)
    expect(a.rgb.g, 166)
    expect(a.rgb.b, 166)
    expect(a.hex, '#10a6a6')
    expect(a.hsl.h, 0.5)
    expect(a.hsl.s, 0.8241758241758241)
    expect(a.hsl.l, 0.3568627450980392)

    a.hsl = {
        h: 0.166,
        s: 0.79,
        l: 0.46
    }

    expect(a.rgb.r, 210)
    expect(a.rgb.g, 209)
    expect(a.rgb.b, 25)
    expect(a.hex, '#d2d119')
    expect(a.hsl.h, 0.166)
    expect(a.hsl.s, 0.79)
    expect(a.hsl.l, 0.46)

    a.hsl.s = 0.1;

    expect(a.rgb.r, 129)
    expect(a.rgb.g, 129)
    expect(a.rgb.b, 106)
    expect(a.hex, '#81816a')
    expect(a.hsl.h, 0.166)
    expect(a.hsl.s, 0.1)
    expect(a.hsl.l, 0.46)

    a = new Color({
        h: 0.06944,
        s: 0.87,
        l: 0.49
    });

    expect(a.rgb.r, 234)
    expect(a.rgb.g, 107)
    expect(a.rgb.b, 16)
    expect(a.hex, '#ea6b10')
    expect(a.hsl.h, 0.06957186544342508)
    expect(a.hsl.s, 0.872)
    expect(a.hsl.l, 0.49019607843137253)

    a.hex = '#030438'

    expect(a.rgb.r, 3)
    expect(a.rgb.g, 4)
    expect(a.rgb.b, 56)
    expect(a.hex, '#030438')
    expect(a.hsl.h, 0.6635220125786163)
    expect(a.hsl.s, 0.8983050847457626)
    expect(a.hsl.l, 0.11568627450980393)
}