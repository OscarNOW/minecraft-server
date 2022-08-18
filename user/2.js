const { Server } = require('../');
const server = new Server({
    defaultClientProperties: client => {
        console.log(client.rightHanded)

        return {}
    }
});

server.on('connect', client => { // The set position is sent, when this function is finished
    console.log(`${client.username} connected`);
})

server.on('join', client => {
    console.log(`${client.username} joined`);
});

server.on('leave', client => {
    console.log(`${client.username} left`);
})