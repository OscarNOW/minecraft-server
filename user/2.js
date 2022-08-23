const { Text } = require('../');

let text = new Text([
    {
        text: 'hi',
        color: 'green'
    },
    {
        text: ' world',
        color: 'blue'
    }
])

console.log(text.string)
text.uncolored = text.uncolored
console.log(text.string)