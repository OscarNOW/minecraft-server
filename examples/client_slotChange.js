const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {
    client.on('change', 'slot', slot => {
        client.chat(`Switched to slot ${slot}`);
    });
});

server.on('listening', () => console.log('Listening on localhost:25565'));
server.listen();