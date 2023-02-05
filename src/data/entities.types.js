const { convertToType } = require('../functions/convertToType.js');
const specialArgumentEntityNames = [
    'player'
];

module.exports = {
    entityName: ['defaultArgumentEntityName', ...specialArgumentEntityNames.map(a => `"${a}"`)].join('|'), //todo: use covertToType
    defaultArgumentEntityName: convertToType(
        require('./entities.json')
            .map(({ name }) => name)
            .filter(a => !specialArgumentEntityNames.includes(a))
    )
}