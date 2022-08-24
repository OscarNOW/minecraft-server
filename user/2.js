const { Server, Text } = require('../');

let text = new Text('Hello world')
console.log(require('util').inspect(text.chat, { depth: null }))

const server = new Server();

server.on('connect', client => {
    client.raw('chat', {
        message: JSON.stringify(text.chat),
        position: 0,
        sender: '0'
    })
})