const { Server } = require('../')
const server = new Server()

server.on('join', () => server.close())