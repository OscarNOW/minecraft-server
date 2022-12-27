const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    difficulty: convertToType(require('./difficulties.json'))
}