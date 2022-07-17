let blockStates = require('./blocks.json').map(a => a.states).flat().map(a => [a.name, a.values])
let newBlockStates = [];

blockStates.forEach(([name, values]) => {
    if (newBlockStates.find(([foundName, foundValues]) => name === foundName))
        newBlockStates.find(([foundName, foundValues]) => name === foundName)[1] = [... new Set(values.concat(newBlockStates.find(([foundName, foundValues]) => name === foundName)[1]))]
    else
        newBlockStates.push([name, values])
})

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