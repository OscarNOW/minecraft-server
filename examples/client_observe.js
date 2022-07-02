const { Server } = require('minecraft-server')
const server = new Server()

server.on('join', client => {
    client.position = {}

    client.observe('slot', slot => console.log(`Client switched slot to ${slot}`))
})