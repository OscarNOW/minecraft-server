const { convertToType } = require('../functions/convertToType.js');
const customEntityClasses = [
    {
        class: 'Horse',
        minecraft: 'horse'
    },
    {
        class: 'Boat',
        minecraft: 'boat'
    }
];

module.exports = {
    entityName: ['normalEntityName', ...customEntityClasses.map(({ minecraft }) => minecraft).map(a => `'${a}'`)].join('|'),
    normalEntityName: convertToType(Object.keys(require('./entities.json')).filter(a => !customEntityClasses.find(({ minecraft }) => minecraft === a))),
}