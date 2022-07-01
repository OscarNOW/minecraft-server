const { Server } = require('.');
const server = new Server();

server.on('join', client => {
    client.position = {}

    let horse = client.entity('horse', client.position)
    horse.animation('hello')
})