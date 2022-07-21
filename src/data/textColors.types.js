module.exports = {
    textColor: [...require('./textColors.json').map(a => a.name), 'default'].map(a => `'${a}'`).join('|'),
    minecraftTextColor: [...require('./textColors.json').map(a => a.minecraftName), 'reset'].map(a => `'${a}'`).join('|')
}