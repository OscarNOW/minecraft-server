const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    demoMessage: convertToType(require('./demoMessages.json').map(({ name }) => name))
}