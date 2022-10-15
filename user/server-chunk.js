const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.blocks.find(b => b.x == x && b.y == y && b.z == z).block = { name: 'dirt' }

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

console.log('Listening')
server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.on('inventoryClose', () => client.chat(1))

    let horse = client.entity('horse', { x: 0, y: 100, z: 0 })
    client.on('join', () => {
        horse.window()
    })
})