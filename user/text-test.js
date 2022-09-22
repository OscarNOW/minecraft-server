const { Text } = require('../');

let a = new Text([
    {
        text: 'Hello',
        clickEvent: {
            action: 'open_url',
            value: 'https://google.com'
        }
    },
    ' world'
])

console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))