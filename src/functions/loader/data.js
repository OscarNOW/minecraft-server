const CJSON = JSON;
const fs = require('fs');
const path = require('path');

let data =
    fs
        .readdirSync(path.resolve(__dirname, '../../data/'))
        .filter(a => a.endsWith('.json'))
        .map(a => path.resolve(__dirname, '../../data/', a));

let cachedData = {};
let lazyData = {};

const dataConverters = {
    items: items => items.map(item => ({
        id: item[0],
        displayName: item[1],
        name: item[2],
        maxStackSize: item[3]
    }))
};

for (const datum of data) {
    const name = datum.split('.js')[0].split('\\').pop().split('/').pop();

    Object.defineProperty(lazyData, name, {
        configurable: false,
        enumerable: true,
        get: () => {
            if (cachedData[name])
                return cachedData[name];

            cachedData[name] = CJSON.parse(fs.readFileSync(datum).toString());
            if (dataConverters[name])
                cachedData[name] = dataConverters[name](cachedData[name]);

            return cachedData[name];
        }
    })
}

module.exports = Object.freeze(lazyData);