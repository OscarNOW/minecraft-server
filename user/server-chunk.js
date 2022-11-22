const { Server, Chunk } = require('../');
// const wait = ms => new Promise(res => setTimeout(res, ms));

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
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    await client.tabItem({
        name: 'Jeroen64',
        displayName: [{ text: 'Hello', modifiers: ['bold'] }],
        uuid: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
        skinAccountUuid: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813'
    });

    // client.raw('player_info', {
    //     action: 0,
    //     data: [{
    //         UUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
    //         name: 'Jeroen64',
    //         properties: [],
    //         gamemode: 0,
    //         ping: -1,
    //         displayName: JSON.stringify([{ text: 'Hello', bold: true }])
    //     }]
    // })

    // client.raw('named_entity_spawn', {
    //     entityId: 10,
    //     playerUUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813', //Jeroen64
    //     x: 3,
    //     y: 101,
    //     z: 3,
    //     yaw: 0,
    //     pitch: 0
    // });

    // client.raw('player_info', {
    //     action: 4,
    //     data: [{
    //         UUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813', //Jeroen64
    //     }]
    // });

});