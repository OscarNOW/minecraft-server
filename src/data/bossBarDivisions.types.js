const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    bossBarDivisionAmount: convertToType(require('./bossBarDivisions.json').map(({ divisions }) => divisions))
}