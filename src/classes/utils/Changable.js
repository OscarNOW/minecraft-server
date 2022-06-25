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

    setRaw(valuesOrKey, value) {
        if (value !== undefined)
            this[rawValuesSymbol][valuesOrKey] = value
        else
            this[rawValuesSymbol] = valuesOrKey;
    }
}

module.exports = Object.freeze({ Changable })