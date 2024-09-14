const { Server, Chunk } = require('../');
console.log('Loaded library')
const wait = ms => new Promise(res => setTimeout(res, ms));

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 90; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 5,
            y: 100,
            z: 5
        }
    })
});

const uuid = {
    'boem231': '4e251f1b-5d8f-42a4-8d09-15e08ebb575a',
    'Jeroen64': '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
    'Notch': '069a79f4-44e9-4726-a5be-fca90e38aaf5',
    'Dream': 'ec70bcaf-702f-4bb8-b48d-276fa52a780c'
}

server.on('listening', () => console.log('Listening'))
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    let player = await client.entity('player', { x: 3, y: 100, z: 3, yaw: 0, pitch: 0 }, {
        name: 'Jeroen64',
        uuid: uuid.boem231,
        skinAccountUuid: uuid.Notch
    });

    client.on('chat', (a) => { player.name = a });
});