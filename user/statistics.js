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
            statistic: 'damageDealt',
            value: 11.28
        }
    ];

    // client.on('statisticsOpen', () => {
    //     console.log('statisticsOpen');
    // });

    // client.p.clientOn('client_command', ({ actionId }) => {
    //     if (actionId !== 1) return;

    //     client.p.sendPacket('statistics', {
    //         // entries: new Array(15).fill(null).map((_, i) => ({
    //         //     categoryId: 8,
    //         //     statisticId: i + 55,
    //         //     value: (i + 55)
    //         // }))
    //         entries: [
    //             {
    //                 categoryId: 8,
    //                 statisticId: 70,
    //                 value: 70
    //             },
    //             {
    //                 categoryId: 8,
    //                 statisticId: 71,
    //                 value: 71
    //             },
    //             {
    //                 categoryId: 8,
    //                 statisticId: 72,
    //                 value: 72
    //             },
    //             {
    //                 categoryId: 8,
    //                 statisticId: 73,
    //                 value: 73
    //             },
    //         ]
    //     });
    // });
});