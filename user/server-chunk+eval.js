const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

chunk.setBlock({ x: 3, y: 100, z: 3 }, 'oak_wall_sign', { waterlogged: false, facing: 'north' })

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

server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.on('signEditorClose', (text, location) => (console.log(text), console.log(location)))

    client.on('chat', a => eval(a));
})

server.on('join', client => {
    client.signEditor({
        x: 3,
        y: 100,
        z: 3
    })
})