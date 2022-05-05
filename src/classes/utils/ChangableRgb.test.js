const { ChangableRgb } = require('./ChangableRgb.js');

module.exports = expect => {
    let updated = false;
    let a = new ChangableRgb(rgb => {
        updated = true;
    }, {
        r: 1,
        g: 2,
        b: 3
    });

    expect(a.r, 1);
    expect(a.g, 2);
    expect(a.b, 3);

    a.r = 4;
    expect(a.r, 4);
    expect(updated, true);
    updated = false;

    a.g = 5;
    expect(a.g, 5);
    expect(updated, true);
    updated = false;

    a.b = 6;
    expect(a.b, 6);
    expect(updated, true);
    updated = false;
}