const { Server, Chunk } = require('../');
console.log('Loaded library')
const wait = ms => new Promise(res => setTimeout(res, ms));

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

const uuid = {
    'Jeroen64': '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
    'Notch': '069a79f4-44e9-4726-a5be-fca90e38aaf5',
    'Dream': 'ec70bcaf-702f-4bb8-b48d-276fa52a780c'
}

server.on('listening', () => console.log('Listening'))
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    // let tabItem1 = await client.tabItem({
    //     name: 'bbb'
    // });

    // let player = await client.entity('player', {
    //     x: 3,
    //     y: 100,
    //     z: 3
    // }, { tabItem });

    // client.on('change', 'slot', () => {
    // tabItem1.uuid = uuid.Dream;
    // });

    // console.log(require('util').inspect(player, { depth: 0, colors: true }))

    // client.on('chat', a => { console.log(a); eval(a) })

    let player = await client.entity('player', { x: 3, y: 100, z: 3, yaw: 0, pitch: 0 }, {
        name: 'Jeroen64',
        uuid: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
        skinAccountUuid: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813'
    });

    client.on('chat', (a) => { player.name = a });
    client.on('change', 'slot', () => { player.tabItem.name = 'Test' });

    // client.on('armSwing', () => {
    //     player.playerInfo = player.playerInfo === tabItem1 ? tabItem2 : tabItem1;
    // })

    // while (client.online) {
    //     player.position.z += 0.2;
    //     await wait(100);
    // }

    // client.raw('player_info', {
    //     action: 0,
    //     data: [{
    //         UUID: uuid.Notch,
    //         name: 'bbb',
    //         properties: [],
    //         gamemode: 1,
    //         ping: 5,
    //         displayName: '"ccc"'
    //         // displayName: JSON.stringify([{ text: 'World', bold: true }])
    //     }]
    // })

    // client.raw('player_info', {
    //     action: 0,
    //     data: [{
    //         UUID: uuid.Jeroen64,
    //         name: 'aaa',
    //         properties: [],
    //         gamemode: 1,
    //         ping: 5,
    //         displayName: '"ddd"'
    //         // displayName: JSON.stringify([{ text: 'Hello', bold: true }])
    //     }]
    // })

    // client.raw('named_entity_spawn', {
    //     entityId: 10,
    //     playerUUID: uuid.Jeroen64,
    //     x: 3,
    //     y: 101,
    //     z: 3,
    //     yaw: 0,
    //     pitch: 0
    // });

    // client.raw('player_info', {
    //     action: 4,
    //     data: [{
    //         UUID: uuid.Jeroen64
    //     }]
    // });

    // client.raw('player_info', {
    //     action: 0,
    //     data: [{
    //         UUID: uuid.Jeroen64,
    //         name: 'Hello world',
    //         properties: [],
    //         gamemode: 1,
    //         ping: 5,
    //         // displayName: JSON.stringify([{ text: 'Hello', bold: true }])
    //     }]
    // })

});