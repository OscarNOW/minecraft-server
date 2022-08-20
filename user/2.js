const { Server } = require('../');
const server = new Server();

server.on('connect', client => { // The set position is sent, when this function is finished
    client.on('join', () => console.log('join'))
    client.on('leave', () => console.log('leave'))
})