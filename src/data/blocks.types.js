let blockStates = require('./blocks.json').map(a => a[2] || []).flat().map(a => [a.name, a.values])
let newBlockStates = [];

for (const [name, values] of blockStates)
    if (newBlockStates.find(([foundName]) => name === foundName))
        newBlockStates.find(([foundName]) => name === foundName)[1] = [... new Set(values.concat(newBlockStates.find(([foundName]) => name === foundName)[1]))]
    else
        newBlockStates.push([name, values])

module.exports = {
    blockType: require('./blocks.json').map(a => a.name).map(a => `'${a}'`).join('|'),
    blockState: `{${newBlockStates.map(([name, values]) => `${name}?:${convertToType(values)};`).join('')}}`
}

function convertToType(values) {
    let type = values.map(a => ['number', 'boolean'].includes(typeof a) ? a : `'${a}'`).sort().join('|');
    if (type == ['true', 'false'].sort().join('|'))
        type = 'boolean'

    return type
}