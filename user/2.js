const { Server } = require('../');
const server = new Server();

server.on('connect', client => {
    console.log(`${client.username} joined`);
    client.on('chat', message => console.log(`<${client.username}> ${message}`));
})

server.on('join', client => {
    client.chat(`Welcome to the server, ${client.username}!`);
});

server.on('leave', client => {
    console.log(`${client.username} left`);
})