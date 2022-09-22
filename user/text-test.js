const { Text } = require('../');

let a = new Text([
    {
        keybind: 'key.attack'
    },
    ' world'
])

console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))