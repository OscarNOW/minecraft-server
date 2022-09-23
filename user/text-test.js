const { Text } = require('../');

let a = new Text([
    {
        text: 'Hello',
        modifiers: ['bold', 'italic', 'underlined']
    },
    {
        text: ' world',
        modifiers: ['bold', 'italic']
    },
    {
        text: ' people',
        modifiers: ['italic', 'underlined']
    }
])

// console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))