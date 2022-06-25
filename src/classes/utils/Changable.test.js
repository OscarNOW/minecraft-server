const Changable = require('./Changable.js')

module.exports = expect => {
    let count = 0;
    let values;

    const changable = new Changable(v => { count++; values = v }, { a: 1, b: 2 });
    expect(changable.a, 1)
    expect(changable.b, 2)
    expect(count, 0)

    changable.a = 3;
    expect(changable.a, 3)
    expect(changable.b, 2)
    expect(values.a, 3)
    expect(values.b, 2)
    expect(count, 1)

    changable.b = 4;
    expect(changable.a, 3)
    expect(changable.b, 4)
    expect(values.a, 3)
    expect(values.b, 4)
    expect(count, 2)

    changable.a += 3;
    expect(changable.a, 6)
    expect(changable.b, 4)
    expect(values.a, 6)
    expect(values.b, 4)
    expect(count, 3)
}