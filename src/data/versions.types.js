const { convertToType } = require('../functions/convertToType.js');
const versions = require('./versions.json');

module.exports = {
    legacyVersion: convertToType(versions.filter(a => a.legacy).map(a => a.version)),
    newVersion: convertToType(versions.filter(a => !a.legacy).map(a => a.version)),
    version: 'legacyVersion | newVersion'
}