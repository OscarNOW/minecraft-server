const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    gamemode: convertToType(require('./gamemodes.json'))
}