const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify({
            translate: 'Hello %s',
            with: [
                'world'
            ]
        }),
        position: 0,
        sender: '0'
    })
})