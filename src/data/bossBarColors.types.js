const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    bossBarColorNames: convertToType(require('./bossBarColors.json').map(({ name }) => name))
}