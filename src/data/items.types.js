module.exports = {
    itemType: require('./items.json').map(a => `'${a[0]}'`).join('|')
}