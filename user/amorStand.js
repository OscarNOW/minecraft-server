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
            x: 5,
            y: 101,
            z: 5
        }
    })
});

let armorStand;

server.on('connect', client => {
    client.chunk(chunk, { x: 0, z: 0 })

    let isFirst = server.clients.length === 1;

    if (isFirst)
        client.on('change', 'position', pos => {
            if (armorStand) {
                armorStand.position = pos;
            }
        })
    else {
        armorStand = client.entity('armor_stand', { x: 3, y: 101, z: 3 });
        client.on('change', 'slot', () => {
            armorStand.camera();
            client.on('leave', process.exit)
        })
    }
})

server.on('listening', () => console.log('Listening on localhost:25565'));
server.listen();