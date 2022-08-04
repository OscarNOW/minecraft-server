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

let armorStand;

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })

    let isFirst = server.playerCount == 1;

    if (isFirst)
        client.observe('position', pos => {
            if (armorStand)
                armorStand.position = pos;
        })
    else {
        armorStand = client.entity('armor_stand', { x: 3, y: 101, z: 3 });
        client.observe('slot', () => {
            armorStand.camera();
        })
    }

    client.loadWorld()
})