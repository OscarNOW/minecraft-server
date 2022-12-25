const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {
    client.on('change', 'slot', slot => {
        console.log(`${client.username} switched slot to ${slot}`)
    });
});