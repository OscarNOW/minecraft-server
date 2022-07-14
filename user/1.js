const { Server } = require('../');
const server = new Server();

server.on('join', client => {
    client.bossBar()

    client.loadWorld()
});