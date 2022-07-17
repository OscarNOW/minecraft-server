module.exports = {
    itemType: Object.keys(require('./items.json')).map(a => `'${a}'`).join('|')
}