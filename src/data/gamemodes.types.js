const { convertToType } = require('../functions/convertToType.js');
const { gamemodes } = require('../functions/loader/data.js');

module.exports = {
    gamemode: convertToType(gamemodes)
}