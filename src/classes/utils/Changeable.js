const valuesSymbol = Symbol('values');
const util = require('util');
const path = require('path');

class Changeable {
    constructor(changeCallback, startValues) {
        // todo: add option to define custom name, so that console.log shows for example 'position {' instead of 'Changeable {'
        // todo: or maybe instead change name to "" so that console.log shows ' {'

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

    // not set raw(...) , because we could also set by key value
    setRaw(valuesOrKey, value) {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected setRaw call from outside of the module. This is not recommended and may cause unexpected behavior.');

        if (value !== undefined)
            this[valuesSymbol][valuesOrKey] = value
        else
            this[valuesSymbol] = Object.assign({}, valuesOrKey);
    }

    get raw() {
        return Object.assign({}, this[valuesSymbol])
    }

    toString() {
        return util.inspect(this.raw, { colors: true });
    }

    [util.inspect.custom]() {
        return this.toString();
    }
}

module.exports = Changeable;