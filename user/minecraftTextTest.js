const { Server } = require('../');
const server = new Server();

server.on('connect', client => {
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
});

server.on('listening', () => console.log('Listening'));
server.listen();