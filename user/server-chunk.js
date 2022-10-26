const { Server, Chunk, ProxyClient } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

let proxyClient = new ProxyClient();
proxyClient.onPacket((name, packet) => {
    if (name == 'map_chunk')
        console.log('<-', name, '...');
    else
        console.log('<-', name, packet);

    if (name == 'login')
        proxyClient.sendPacket('settings', {
            locale: 'en_US',
            viewDistance: 8,
            chatFlags: 0,
            chatColors: true,
            skinParts: 0,
            mainHand: 0
        })
})

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
})

// server.joinProxyClient(proxyClient);