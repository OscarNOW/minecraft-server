const { convertToType } = require('../functions/convertToType.js');
const { difficulties } = require('../functions/loader/data.js');

module.exports = {
    difficulty: convertToType(difficulties)
}