const { convertToType } = require('../functions/convertToType.js');
const { bossBarColors } = require('../functions/loader/data.js');

module.exports = {
    bossBarColorName: convertToType(bossBarColors)
}