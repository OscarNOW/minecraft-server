const { ChangablePosition } = require('./ChangablePosition');

module.exports = expect => {
    let updated = false;
    let a = new ChangablePosition(pos => {
        updated = true;
    }, {
        x: 1,
        y: 2,
        z: 3,
        yaw: 4,
        pitch: 5
    });

    expect(a.x, 1);
    expect(a.y, 2);
    expect(a.z, 3);
    expect(a.yaw, 4);
    expect(a.pitch, 5);

    a.x = 6;
    expect(a.x, 6);
    expect(updated, true);
    updated = false;

    a.y = 7;
    expect(a.y, 7);
    expect(updated, true);
    updated = false;

    a.z = 8;
    expect(a.z, 8);
    expect(updated, true);
    updated = false;

    a.yaw = 9;
    expect(a.yaw, 9);
    expect(updated, true);
    updated = false;

    a.pitch = 10;
    expect(a.pitch, 10);
    expect(updated, true);
    updated = false;
}