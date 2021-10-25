const ChangablePosition = require('./ChangablePosition').ChangablePosition;

module.exports = expect => {
    let updated = false;
    let temp = new ChangablePosition(pos => {
        updated = true;
    }, {
        x: 1,
        y: 2,
        z: 3,
        yaw: 4,
        pitch: 5
    });

    expect(temp.x, 1);
    expect(temp.y, 2);
    expect(temp.z, 3);
    expect(temp.yaw, 4);
    expect(temp.pitch, 5);

    temp.x = 6;
    expect(temp.x, 6);
    expect(updated, true);
    updated = false;

    temp.y = 7;
    expect(temp.y, 7);
    expect(updated, true);
    updated = false;

    temp.z = 8;
    expect(temp.z, 8);
    expect(updated, true);
    updated = false;

    temp.yaw = 9;
    expect(temp.yaw, 9);
    expect(updated, true);
    updated = false;

    temp.pitch = 10;
    expect(temp.pitch, 10);
    expect(updated, true);
    updated = false;

    temp.raw.x = 11;
    expect(updated, false);
    expect(temp.x, 11);

    temp.raw.y = 12;
    expect(updated, false);
    expect(temp.y, 12);

    temp.raw.z = 13;
    expect(updated, false);
    expect(temp.z, 13);

    temp.raw.yaw = 14;
    expect(updated, false);
    expect(temp.yaw, 14);

    temp.raw.pitch = 15;
    expect(updated, false);
    expect(temp.pitch, 15);
}