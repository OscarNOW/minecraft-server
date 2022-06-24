let blockStates = require('./blocks.json').map(a => a.states).flat().map(a => [a.name, a.values])
let newBlockStates = [];

blockStates.forEach(([name, values]) => {
    if (newBlockStates.find(([foundName, foundValues]) => name === foundName))
        newBlockStates.find(([foundName, foundValues]) => name === foundName)[1] = [... new Set(values.concat(newBlockStates.find(([foundName, foundValues]) => name === foundName)[1]))]
    else
        newBlockStates.push([name, values])
})

module.exports = {
    blockType: `'${require('./blocks.json').map(a => a.name).join("' | '")}'`,
    blockState: `{
        ${newBlockStates.map(([name, values]) => `${name}: ${convertToTypes(values)};`).join('\n    ')}
    }`
}

function convertToTypes(values) {
    let types = values.map(a => ['number', 'boolean'].includes(typeof a) ? a : `'${a}'`).join(' | ');
    if (types == 'true | false')
        types = 'boolean'

    return types
}