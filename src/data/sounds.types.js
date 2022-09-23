const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    soundName: convertToType(require('./sounds.json').map(({ name }) => name))
}