const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    noDataParticle: convertToType(
        require('./particles.json')
            .filter(({ requiresData }) => !requiresData)
            .map(({ name }) => name)
    )
}