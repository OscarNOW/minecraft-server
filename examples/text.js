const { Text, Server } = require('@boem312/minecraft-server');
const message = new Text([
    {
        text: 'Hello ',
        color: 'darkGreen',
        modifiers: [
            'bold',
            'italic'
        ],
        clickEvent: {
            action: 'open_url',
            value: 'https://example.com'
        }
    },
    {
        text: 'world',
        color: 'purple',
        modifiers: [
            'underline',
            'strike'
        ],
        clickEvent: {
            action: 'suggest_command',
            value: '/example'
        }
    }
]);

const server = new Server();

server.on('connect', client => {
    client.chat(message)
});

server.on('listening', () => console.log('Listening on localhost:25565'));