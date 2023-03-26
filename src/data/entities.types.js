const { convertToType } = require('../functions/convertToType.js');
const specialArgumentEntityNames = [
    'player',
    'experience_orb'
];

module.exports = {
    entityName: ['defaultArgumentEntityName', ...specialArgumentEntityNames.map(a => `"${a}"`)].join('|'),
    defaultArgumentEntityName: convertToType(
        require('./entities.json')
            .map(({ name }) => name)
            .filter(a => !specialArgumentEntityNames.includes(a))
    )
}