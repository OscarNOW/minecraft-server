module.exports = {
    blockType: `'${require('./blocks.json').map(a => a.name).join("' | '")}'`
}