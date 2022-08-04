const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

const server = new Server({
    defaultClientProperties: client => ({
        gamemode: 'creative',
        position: {
            x: 5,
            y: 101,
            z: 5
        }
    })
})

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })

    let armorStand = client.entity('armor_stand', { x: 3, y: 101, z: 3 });
    client.observe('position', pos => {
        armorStand.position = pos;
    });
    client.observe('slot', () => {
        armorStand.camera()
    })

    client.loadWorld()
})