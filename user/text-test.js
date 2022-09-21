const { Text } = require('../');

let a = Text.arrayToChat([
    {
        text: 'Hello',
        color: 'darkRed',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.google.com'
        }
    },
    {
        text: ' world',
        color: 'darkGreen',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.google.com'
        }
    }
])

console.log(a)