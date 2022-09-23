const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify(
            [
                { bold: true, italic: true, text: 'Hello', insertion: 'Hello' },
                { text: ' World', insertion: '' }
            ]
        ),
        position: 0,
        sender: '0'
    })
})