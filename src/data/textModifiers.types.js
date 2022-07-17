module.exports = {
    textModifier: require('./textModifiers.json').map(({ name }) => name).filter(a => a != 'reset').map(a => `'${a}'`).join('|'),
}