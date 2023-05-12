const { convertToType } = require('../functions/convertToType.js');
const { items } = require('../functions/loader/data.js');

module.exports = {
    itemName: convertToType(items.map(({ name }) => name)),
    itemDisplayName: convertToType(items.map(({ displayName }) => displayName))
}