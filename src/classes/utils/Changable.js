const valuesSymbol = Symbol('values');

class Changable {
    constructor(changeCallback, startValues) {
        this[valuesSymbol] = startValues;

        for (const [key, value] of Object.entries(startValues))
            Object.defineProperty(this, key, {
                get: () => this[valuesSymbol][key],
                set: newValue => {
                    this[valuesSymbol][key] = newValue;
                    changeCallback(this[valuesSymbol]);
                }
            })

    }

    setRaw(valuesOrKey, value) {
        if (value !== undefined)
            this[valuesSymbol][valuesOrKey] = value
        else
            this[valuesSymbol] = valuesOrKey;
    }
}

module.exports = Object.freeze({ Changable })