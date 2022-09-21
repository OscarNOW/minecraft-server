module.exports = {
    itemName: require('./items.json').map(a => `'${a[0]}'`).join('|')
}