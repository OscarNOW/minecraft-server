const fs = require('fs');
const path = require('path');

let xports = [];
let utils = [];

for (const file of fs
    .readdirSync(path.resolve(__dirname, '../../classes/exports/'))
    .filter(file => file.split('.').length === 2)
)
    xports.push(`../../classes/exports/${file}`)

for (const file of fs
    .readdirSync(path.resolve(__dirname, '../../classes/utils/'))
    .filter(file => file.split('.').length === 2)
)
    utils.push(`../../classes/utils/${file}`)

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

let cachedUtils = {};
let lazyUtils = {};

for (const xport of xports) {
    const name = xport.split('/')[xport.split('/').length - 1].split('.')[0];

    Object.defineProperty(lazyUtils, name, {
        configurable: false,
        enumerable: true,
        get: () => {
            if (cachedUtils[name])
                return cachedUtils[name];

            cachedUtils[name] = require(xport);
            return cachedUtils[name];
        }
    })
}

module.exports = Object.freeze({ exports: lazyExports, utils: lazyUtils })