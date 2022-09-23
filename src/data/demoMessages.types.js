const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    demoMessage: convertToType(Object.keys(require('./demoMessages.json')))
}