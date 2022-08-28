const { Text } = require('../');

let a = Text.parseArray({
    text: 'Hello World'
})

console.log(a)

/*
const { Server } = require('../');
const server = new Server();

server.on('connect', client => {
    client.raw('chat', {
        message: JSON.stringify({
            text: 'Hello, world!',
            insertion: ''
        }),
        position: 0,
        sender: '0'
    })
})
//*/