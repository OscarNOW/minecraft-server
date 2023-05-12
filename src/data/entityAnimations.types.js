const { convertToType } = require('../functions/convertToType.js');
const { entityAnimations } = require('../functions/loader/data.js');

module.exports = {
    entityAnimationType: convertToType(entityAnimations)
}