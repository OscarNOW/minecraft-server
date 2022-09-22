const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify({
            text: 'Hi'
        }),
        position: 0,
        sender: '0'
    })
})