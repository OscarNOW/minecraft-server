const { Text } = require('../');

//*
let a = Text.arrayToChat([
    {
        text: 'Hello',
        color: 'darkRed',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.youtube.com'
        }
    },
    {
        text: ' world',
        color: 'darkRed',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.google.com'
        }
    }
])

console.log(a)
//*/

/*
const { Server } = require('../');
const server = new Server();

server.on('connect', client => {
    client.raw('chat', {
        message: JSON.stringify({
            text: 'Hello, world!',
            clickEvent: {
                action: 'open_url',
                value: 'https://google.com'
            },
            extra: [true]
        }),
        position: 0,
        sender: '0'
    })
})
//*/