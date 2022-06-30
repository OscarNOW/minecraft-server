const { Text } = require('.');
const text = new Text('§lHello World');

console.log(`${text}`)

text.string = '§.Hello World'

console.log(`${text}`)