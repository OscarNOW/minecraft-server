const fs = require('fs');
const path = require('path');
const { createLazyClass } = require('../createLazyClass.js');

let exportFilePaths = [];

for (const file of fs
    .readdirSync(path.resolve(__dirname, '../../classes/exports/'))
    .filter(file => file.split('.').length === 2)
)
    exportFilePaths.push([`../../classes/exports/${file}`, file.split('.')[0]]);

let lazyExports = {};

for (const [exportFilePath, name] of exportFilePaths)
    lazyExports[name] = createLazyClass(() => require(exportFilePath), name);

module.exports = Object.freeze(lazyExports)