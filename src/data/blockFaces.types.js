const { convertToType } = require('../functions/convertToType.js');
const { blockFaces } = require('../functions/loader/data.js');

module.exports = {
    blockFace: convertToType(blockFaces)
}