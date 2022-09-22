const { Text } = require('../');

let a = new Text([
    {
        translate: 'tutorial.move.title',
        modifiers: ['bold'],
        with: [
            {
                keybind: 'key.forward'
            },
            {
                keybind: 'key.left'
            },
            {
                keybind: 'key.back'
            },
            {
                keybind: 'key.right'
            }
        ]
    }
])

console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))