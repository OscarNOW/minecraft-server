const { Server } = require('../')
const server = new Server()

server.on('join', client => {
    client.particle('cloud', true, 100, client.position, { x: 1, y: 1, z: 1 })
})