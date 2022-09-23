const { Text } = require('../');

let a = new Text([
    {
        text: 'Hello',
        modifiers: ['bold', 'italic'],
        insertion: 'Hello'
    },
    {
        text: ' World',
        modifiers: ['bold', 'italic']
    }
])

// console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))