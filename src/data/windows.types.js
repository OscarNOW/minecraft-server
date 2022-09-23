module.exports = {
    nonEntityWindowName: require('./windows.json').filter(({ name }) => name != 'horse').map(({ name }) => name).map(a => `'${a}'`).join('|')
}