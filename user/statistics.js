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
            x: 1,
            y: 100,
            z: 3
        }
    })
});

server.on('listening', () => console.log('Listening'))
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.statistics = [
        {
            category: 'custom',
            statistic: 'jumps',
            value: 1000
        }
    ];

    client.on('statisticsOpen', () => {
        console.log('statisticsOpen');
    });

    // client.p.sendPacket('statistics', {
    //     entries: new Array(45).fill(null).map((_, i) => ({
    //         categoryId: 8,
    //         statisticId: i,
    //         value: 5
    //     }))
    // });
    // client.p.clientOn('client_command', ({ actionId }) => {
    //     if (actionId !== 1) return;

    //     console.log('statistics')
    //     client.p.sendPacket('statistics', {
    //         entries: []
    //     });
    // });
});