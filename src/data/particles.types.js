const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    noDataParticle: convertToType(Object.entries(
        require('./particles.json')
    )
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => !value.requiresData)
        .map(([key]) => key))
}