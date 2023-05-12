const { convertToType } = require('../functions/convertToType.js');
const { keybinds } = require('../functions/loader/data.js');

module.exports = {
    keycode: convertToType(keybinds.map(({ code }) => code))
}