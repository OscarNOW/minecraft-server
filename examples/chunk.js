const { Chunk, Server } = require('@boem312/minecraft-server');
let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('grass_block', { x, y, z }, { snowy: false });


const server = new Server({
    defaultClientProperties: client => ({
        position: {
            x: 1,
            y: 100,
            z: 1
        }
    })
});

server.on('connect', client => {
    client.chunk(chunk, { x: 0, z: 0 });
});

server.on('listening', () => console.log('Listening on localhost:25565'));