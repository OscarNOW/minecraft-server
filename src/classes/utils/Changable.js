const valuesSymbol = Symbol('values');

class Changable {
    constructor(changeCallback, startValues) {
        Object.defineProperty(this, valuesSymbol, {
            configurable: false,
            enumerable: false,
            writable: true,
            value: Object.assign({}, startValues)
        })

        for (const [key] of Object.entries(this[valuesSymbol]))
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
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
            this[valuesSymbol] = Object.assign({}, valuesOrKey);
    }

    get raw() {
        return Object.assign({}, this[valuesSymbol])
    }
}

module.exports = Changable