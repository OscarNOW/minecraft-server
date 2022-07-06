const { Server, Chunk } = require('../')
const server = new Server();

const chunk = new Chunk()
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })

    client.position = {
        x: 2,
        y: 110,
        z: 2
    }

    client.on('chat', a => eval(a))
})