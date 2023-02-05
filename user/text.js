const { Text } = require('../');

let a = new Text({
    translate: 'demo.day.4',
    with: [
        {
            text: 'Hello',
            color: 'red'
        }
    ]
})

// console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))