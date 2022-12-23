const fs = require('fs');
const path = require('path');

let xports = [];

for (const file of fs
    .readdirSync(path.resolve(__dirname, '../../classes/exports/'))
    .filter(file => file.split('.').length === 2)
)
    xports.push(`../../classes/exports/${file}`)

let cachedExports = {};
let lazyExports = {};

for (const xport of xports) {
    const name = xport.split('.js')[0].split('\\').pop().split('/').pop();

    Object.defineProperty(lazyExports, name, {
        configurable: false,
        enumerable: true,
        get: () => {
            if (cachedExports[name])
                return cachedExports[name];

            cachedExports[name] = require(xport);
            return cachedExports[name];
        }
    })
}

module.exports = Object.freeze(lazyExports)