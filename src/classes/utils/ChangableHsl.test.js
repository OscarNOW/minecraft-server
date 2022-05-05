const { ChangableHsl } = require('./ChangableHsl.js');

module.exports = expect => {
    let updated = false;
    let a = new ChangableHsl(hsl => {
        updated = true;
    }, {
        h: 1,
        s: 2,
        l: 3
    });

    expect(a.h, 1);
    expect(a.s, 2);
    expect(a.l, 3);

    a.h = 4;
    expect(a.h, 4);
    expect(updated, true);
    updated = false;

    a.s = 5;
    expect(a.s, 5);
    expect(updated, true);
    updated = false;

    a.l = 6;
    expect(a.l, 6);
    expect(updated, true);
    updated = false;
}