const { convertToType } = require('../functions/convertToType.js');

let blockStates = require('./blocks.json').map(a => a[2] || []).flat().map(a => [a.name, a.values])
let newBlockStates = [];

for (const [name, values] of blockStates)
    if (newBlockStates.find(([foundName]) => name === foundName))
        newBlockStates.find(([foundName]) => name === foundName)[1] = [... new Set(values.concat(newBlockStates.find(([foundName]) => name === foundName)[1]))]
    else
        newBlockStates.push([name, values])

module.exports = {
    blockName: convertToType(require('./blocks.json').map(a => a[0])),
    blockState: `{${newBlockStates.map(([name, values]) => `${name}?:${convertToType(values)};`).join('')}}`
}