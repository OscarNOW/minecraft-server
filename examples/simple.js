const { Server } = require('minecraft-server');
const server = new Server()

server.on('join', client => {

    client.position = {
        x: 0,
        y: 120,
        z: 0,
        yaw: 0,
        pitch: 0
    };

    client.chat(`Welcome to the server, ${client.username}!`)

    client.on('chat', message => console.log(`<${client.username}> ${message}`))

});