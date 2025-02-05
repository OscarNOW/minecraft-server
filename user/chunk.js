const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 1,
            y: 100,
            z: 3
        }
    })
});

server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    const player = await client.entity('player', { x: 0, y: 100, z: 0 }, {
        uuid: client.uuid,
        name: client.username
    });
});

server.on('listening', () => console.log('Listening'));
server.listen();