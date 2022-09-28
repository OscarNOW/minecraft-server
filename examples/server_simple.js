const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {

    client.on('chat', message => console.log(`<${client.username}> ${message}`));

    console.log(`${client.username} joined`);
    client.chat('Welcome to the server!')

})