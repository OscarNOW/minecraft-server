const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify({
            text: 'Hello',
            italic: true,
            extra: [{
                text: 'Hello',
                bold: true,
                hoverEvent: {
                    action: 'show_text',
                    value: {
                        text: 'Hover'
                    }
                }
            }]
        }),
        position: 0,
        sender: '0'
    })
})