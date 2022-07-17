module.exports = {
    entityType: Object.keys(require('./entities.json')).map(a => `'${a}'`).join('|')
}