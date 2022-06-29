const { Server } = require('minecraft-server');
const server = new Server()

server.on('join', client => {

    // This is necessary to spawn in the client. If you don't
    // specify where to spawn it, the client will spawn at:
    // x: 0, y: 0, z: 0, yaw: 0, pitch: 0
    client.position = {};

    client.chat(`Welcome to the server, ${client.username}!`)

    console.log(`${client.username} joined`)
    client.on('chat', message => console.log(`<${client.username}> ${message}`))

});