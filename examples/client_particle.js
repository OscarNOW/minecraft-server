const { Server } = require('minecraft-server')
const server = new Server()

server.on('join', client => {
    client.loadWorld()

    client.particle(
        'dust',
        true,
        100,
        client.position,
        { x: 1, y: 1, z: 1 },
        {
            r: 64,
            g: 73,
            b: 82
        },
        1
    );
})