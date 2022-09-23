const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    entityType: convertToType(Object.keys(require('./entities.json')))
}