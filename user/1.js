const { Server } = require('../');
const server = new Server({
    defaultClientProperties: () => ({
        position: {
            x: 3,
            y: 10000,
            z: 3
        }
    })
});

server.on('join', client => {

    console.log(`${client.username} joined`);
    client.on('chat', message => console.log(`<${client.username}> ${message}`));

    client.loadWorld();
    client.chat(`Welcome to the server, ${client.username}!`);

});