const { Chunk, Server } = require('@boem312/minecraft-server');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

const server = new Server({
    defaultClientProperties: client => ({
        gamemode: 'creative',
        position: {
            x: 1,
            y: 100,
            z: 3
        }
    })
});

server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });
});

server.on('listening', () => console.log('Listening on localhost:25565'));
server.listen();