const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    bossBarColorName: convertToType(require('./bossBarColors.json').map(({ name }) => name))
}