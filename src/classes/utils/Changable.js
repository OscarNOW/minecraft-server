const rawValuesSymbol = Symbol('rawValues');

class Changable {
    constructor(changeCallback, startValues) {
        this[rawValuesSymbol] = startValues;

        for (const [key, value] of Object.entries(startValues))
            Object.defineProperty(this, key, {
                get: () => this[rawValuesSymbol][key],
                set: newValue => {
                    this[rawValuesSymbol][key] = newValue;
                    changeCallback(this[rawValuesSymbol]);
                }
            })

    }

    setRaw(values) {
        this[rawValuesSymbol] = values;
    }
}

module.exports = Object.freeze({ Changable })