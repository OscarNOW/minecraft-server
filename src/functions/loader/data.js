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

for (const datum of data) {
    const name = datum.split('.')[0].split('\\').pop();

    Object.defineProperty(lazyData, name, {
        configurable: false,
        enumerable: true,
        get: () => {
            if (cachedData[name])
                return cachedData[name];

            cachedData[name] = CJSON.parse(fs.readFileSync(datum).toString());
            return cachedData[name];
        }
    })
}

module.exports = Object.freeze(lazyData);