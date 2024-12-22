const { convertToType } = require('../functions/convertToType.js');
const { statisticCategories } = require('../functions/loader/data.js');

module.exports = {
    statisticCategory: convertToType(statisticCategories)
}