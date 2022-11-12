const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    textModifier: convertToType(require('./textModifiers.json').map(({ name }) => name).filter(a => a !== 'reset')),
}