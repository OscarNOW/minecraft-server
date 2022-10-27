const { Server } = require('@boem312/minecraft-server')
const server = new Server()

server.on('connect', client => {
    client.particle('cloud', true, 100, client.position, { x: 1, y: 1, z: 1 })
})