const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    itemName: convertToType(require('./items.json').map(({ name }) => name)),
    itemDisplayName: convertToType(require('./items.json').map(({ displayName }) => displayName))
}