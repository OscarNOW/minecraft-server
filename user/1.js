const { Server } = require('../');
const server = new Server();

server.on('join', client => {

    console.log(`${client.username} joined`);
    client.on('chat', message => console.log(`<${client.username}> ${message}`));

    client.loadWorld();
    client.chat(`Welcome to the server, ${client.username}!`);

});