const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    itemName: convertToType(require('./items.json').map(a => a[0]))
}