const { Server } = require('minecraft-server')
const server = new Server()

server.on('connect', client => {
    client.observe('slot', slot => console.log(`${client.username} switched slot to ${slot}`))
})