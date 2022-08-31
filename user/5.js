const fs = require('fs')

let blocks = require('../src/data/blocks.json')
blocks = blocks.map(a => {
    let o = [a.name, a.minStateId]

    if (a.states.length != 0)
        o.push(a.states)

    return o
})

fs.writeFileSync('./src/data/blocks.json', JSON.stringify(blocks))