const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    textColor: convertToType([...require('./textColors.json').map(a => a.name), 'default']),
    minecraftTextColor: convertToType([...require('./textColors.json').map(a => a.minecraftName), 'reset'])
}