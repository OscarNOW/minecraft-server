const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    nonEntityWindowName: convertToType(require('./windows.json').filter(({ name }) => name != 'horse').map(({ name }) => name))
}