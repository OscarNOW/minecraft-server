const { convertToType } = require('../functions/convertToType.js');
const { bossBarDivisions } = require('../functions/loader/data.js');

module.exports = {
    bossBarDivisionAmount: convertToType(bossBarDivisions)
}