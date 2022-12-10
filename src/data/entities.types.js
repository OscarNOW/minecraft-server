const { convertToType } = require('../functions/convertToType.js');
const specialArgumentEntityNames = [

];

module.exports = {
    entityName: ['defaultArgumentEntityName', ...specialArgumentEntityNames.map(a => `"${a}"`)].join('|'),
    defaultArgumentEntityName: convertToType(Object.values(Object.keys(require('./entities.json'))).filter(a => !specialArgumentEntityNames.includes(a)))
}