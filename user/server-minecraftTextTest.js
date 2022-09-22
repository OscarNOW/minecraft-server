const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    client.raw('chat', {
        message: JSON.stringify([
            {
                text: 'Hello',
                clickEvent: { action: 'open_url', value: 'https://google.com' }
            },
            {
                text: ' world',
                clickEvent: {
                    action: 'change_page',
                    value: 0
                }
            }
        ]),
        position: 0,
        sender: '0'
    })
})