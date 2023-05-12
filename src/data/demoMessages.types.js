const { convertToType } = require('../functions/convertToType.js');
const { demoMessages } = require('../functions/loader/data.js');

module.exports = {
    demoMessage: convertToType(demoMessages.map(({ name }) => name))
}