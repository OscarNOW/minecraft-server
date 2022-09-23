const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    soundChannel: convertToType(require('./soundChannels.json'))
}