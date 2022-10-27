const { Text, Server } = require('@boem312/minecraft-server');
const message = new Text([
    {
        text: 'Hello ',
        color: 'darkGreen',
        modifiers: [
            'bold',
            'italic'
        ]
    },
    {
        text: 'world',
        color: 'purple',
        modifiers: [
            'underline',
            'strike'
        ]
    }
]);

const server = new Server();

server.on('connect', client => {
    client.chat(message)
});