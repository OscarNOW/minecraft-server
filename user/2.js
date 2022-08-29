const { Text } = require('../');

//*
let a = Text.arrayToChat([
    {
        text: 'Hello',
        color: 'darkRed',
        insertion: 'foo'
    },
    {
        text: ' world',
        color: 'darkGreen',
        insertion: 'bar'
    }
])

Text.minifyChat([
    {

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
            insertion: '12345678',
            extra: [
                {
                    text: ' kkkkkk'
                }
            ]
        }),
        position: 0,
        sender: '0'
    })
})
//*/