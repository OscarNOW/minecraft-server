const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    entityAnimationType: convertToType(require('./entityAnimations.json'))
}