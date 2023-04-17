const { Server, Chunk } = require('../');

let chunk = new Chunk();
// for (let x = 0; x < 16; x++)
//     for (let z = 0; z < 16; z++)
//         for (let y = 0; y < 100; y++)
//             chunk.setBlock('dirt', { x, y, z })
chunk.setBlock('dirt', { x: 1, y: 2, z: 3 })

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 1,
            y: 3,
            z: 3
        }
    })
});

server.on('listening', () => console.log('Listening'))
server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.on('blockBreak', ({ x, y, z }, oldBlock) => {
        console.log(`(${x}, ${y}, ${z}) ${oldBlock.block} -> ${client.blocks[x]?.[y]?.[z]}`)
        client.updateBlock(oldBlock.block, { x, y, z }, oldBlock.state);
        client.acknowledgeBlockBreak({ x, y, z }, false);
    })
});