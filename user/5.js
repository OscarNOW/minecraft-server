const fs = require('fs')

let oldItems = require('../src/data/items.json')
let newItems = []

for (const [key, value] of Object.entries(oldItems))
    newItems.push([key, value.id])

fs.writeFileSync('./src/data/items.json', JSON.stringify(newItems))