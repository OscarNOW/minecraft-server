const versions = require('./versions.json');

module.exports = {
    legacyVersion: versions.filter(a => a.legacy).map(a => a.version).map(a => `'${a}'`).join('|'),
    newVersion: versions.filter(a => !a.legacy).map(a => a.version).map(a => `'${a}'`).join('|'),
    version: "legacyVersion | newVersion"
}