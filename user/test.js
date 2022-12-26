const { Text } = require('../');

let a = new Text(null)

a.on('change', text => {
    console.log(text.string)
});

a.string = 'Hello, world!'
a.string = 'Foo bar'
a.string = 'Foo bar'

// console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))