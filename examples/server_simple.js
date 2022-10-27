const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {

    console.log(`${client.username} joined`);
    client.on('chat', message => console.log(`<${client.username}> ${message}`));

})