const { convertToType } = require('../functions/convertToType.js');
const { entities } = require('../functions/loader/data.js');
const specialArgumentEntityNames = [
    'player',
    'experience_orb'
];

module.exports = {
    entityName: ['defaultArgumentEntityName', ...specialArgumentEntityNames.map(a => `"${a}"`)].join('|'),
    defaultArgumentEntityName: convertToType(
        entities
            .map(({ name }) => name)
            .filter(a => !specialArgumentEntityNames.includes(a))
    )
}