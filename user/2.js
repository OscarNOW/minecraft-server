const { Text } = require('../');

let text = new Text('null')
console.log(require('util').inspect(text.chat, { depth: null, colors: true }));
console.log(JSON.stringify(text.chat))

//*
const { Server } = require('../');
const server = new Server();

server.on('connect', client => {
    client.raw('chat', {
        message: JSON.stringify(text.chat),
        position: 0,
        sender: '0'
    })
})
//*/