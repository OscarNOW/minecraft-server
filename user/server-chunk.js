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

console.log('Listening')
server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.tabItem()

    return;

    client.raw('named_entity_spawn', {
        entityId: 10,
        playerUUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
        x: 3,
        y: 101,
        z: 3,
        yaw: 0,
        pitch: 0
    })

})