module.exports = {
    keycode: require('./keybinds.json').map(({ code }) => code).map(a => `'${a}'`).join('|')
}