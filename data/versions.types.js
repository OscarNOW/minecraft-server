const versions = require('./versions.json');

module.exports = {
    legacyVersion: `'${versions.filter(a => a.legacy).map(a => a.version).join("' | '")}'`,
    newVersion: `'${versions.filter(a => !a.legacy).map(a => a.version).join("' | '")}'`,
    version: "legacyVersion | newVersion"
}