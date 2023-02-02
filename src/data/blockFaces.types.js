const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    blockFace: convertToType(require('./blockFaces.json'))
}