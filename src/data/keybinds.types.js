const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    keycode: convertToType(require('./keybinds.json').map(({ code }) => code))
}