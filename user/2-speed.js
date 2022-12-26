const { Server } = require('../');

console.time('server  ')
const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 5,
            y: 101,
            z: 5
        }
    })
});
console.timeEnd('server  ')

server.close();