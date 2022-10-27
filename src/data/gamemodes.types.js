const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    gamemode: convertToType(Object.keys(require('./gamemodes.json')))
}