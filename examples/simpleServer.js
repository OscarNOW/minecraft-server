const { Server } = require('minecraft-server');
const server = new Server()

server.on('join', client => {

    client.position = {
        x: 0,
        y: 0,
        z: 0
    };

    client.chat(`Welcome to the server, ${client.username}!`)

    console.log(`${client.username} joined`)
    client.on('chat', message => console.log(`<${client.username}> ${message}`))

});