const { Server, Chunk } = require('../');
const server = new Server({
    defaultClientProperties: () => ({
        position: {
            y: 101
        }
    })
});
const chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })

    let horse = client.entity('horse', {
        x: 3,
        y: 100,
        z: 3
    })

    horse.observe('position', console.log)
    client.on('chat', a => eval(a))

    client.loadWorld()
});