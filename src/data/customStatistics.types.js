const { convertToType } = require('../functions/convertToType.js');
const { customStatistics } = require('../functions/loader/data.js');

module.exports = {
    customStatisticName: convertToType(customStatistics.map(({ name }) => name))
}