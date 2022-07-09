const { Server, Chunk } = require('../')
const server = new Server();
let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })
    client.on('chat', a => eval(a))
    client.position = {
        x: 3,
        y: 102,
        z: 3
    }

    client.observe('slot', () => {
        client.noRespawnBlock()
    })
})