console.time('loading ')
const { Server, Chunk } = require('../../');
console.timeEnd('loading ')

console.time('chunk   ')
let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })
console.timeEnd('chunk   ')

console.time('server  ')
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
console.timeEnd('server  ')

console.time('listen  ')
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });
});
console.timeEnd('listen  ')

console.time('close   ')
server.close();
console.timeEnd('close   ')