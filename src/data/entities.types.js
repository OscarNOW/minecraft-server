const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    entityName: convertToType(Object.keys(require('./entities.json')))
}