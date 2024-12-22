const { convertToType } = require('../functions/convertToType.js');
const { customStatistics } = require('../functions/loader/data.js');

module.exports = {
    customStatistic: convertToType(customStatistics)
}