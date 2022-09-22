const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify([
            {
                text: '',
                italic: true
            },
            {
                translate: 'tutorial.move.title',
                bold: true,
                with: [
                    'w',
                    'a',
                    's',
                    'd'
                ]
            }]
        ),
        position: 0,
        sender: '0'
    })
})