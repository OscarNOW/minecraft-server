const { Text } = require('../');

let a = new Text([
    {
        text: 'Hello',
        hoverEvent: {
            action: 'show_text',
            value: {
                text: 'Hello',
                modifiers: ['bold']
            }
        }
    },
    ' world'
])

console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))