const Changeable = require('./Changeable.js')

module.exports = expect => {
    let count = 0;
    let values;

    const changeable = new Changeable(v => { count++; values = v }, { a: 1, b: 2 });
    expect(changeable.a, 1)
    expect(changeable.b, 2)
    expect(count, 0)

    changeable.a = 3;
    expect(changeable.a, 3)
    expect(changeable.b, 2)
    expect(values.a, 3)
    expect(values.b, 2)
    expect(count, 1)

    changeable.b = 4;
    expect(changeable.a, 3)
    expect(changeable.b, 4)
    expect(values.a, 3)
    expect(values.b, 4)
    expect(count, 2)

    changeable.a += 3;
    expect(changeable.a, 6)
    expect(changeable.b, 4)
    expect(values.a, 6)
    expect(values.b, 4)
    expect(count, 3)
}