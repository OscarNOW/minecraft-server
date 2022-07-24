const valuesSymbol = Symbol('values');

class Changable {
    constructor(changeCallback, startValues) {
        this[valuesSymbol] = Object.assign({}, startValues);

        for (const [key, value] of Object.entries(this[valuesSymbol]))
            Object.defineProperty(this, key, {
                get: () => this[valuesSymbol][key],
                set: newValue => {
                    let old = Object.assign({}, this[valuesSymbol]);
                    this[valuesSymbol][key] = newValue;
                    changeCallback(Object.assign({}, this[valuesSymbol]), old);
                }
            })

    }

    setRaw(valuesOrKey, value) {
        if (value !== undefined)
            this[valuesSymbol][valuesOrKey] = value
        else
            this[valuesSymbol] = valuesOrKey;
    }

    get raw() {
        return Object.assign({}, this[valuesSymbol])
    }
}

module.exports = Object.freeze({ Changable })