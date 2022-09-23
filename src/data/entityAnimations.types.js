const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    entityAnimationType: convertToType(Object.keys(require('./entityAnimations.json')))
}