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
    entityName: convertToType(['normalEntityName', customEntityClasses.map(({ minecraft }) => minecraft)]),
    normalEntityName: convertToType(Object.keys(require('./entities.json')).filter(a => !customEntityClasses.find(({ minecraft }) => minecraft === a))),
}