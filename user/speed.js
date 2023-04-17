console.time('mc-prot ')
require('minecraft-protocol');
console.timeEnd('mc-prot ')

console.time('loading ')
const { Server, Chunk } = require('../');
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

let joinCount = 0;
let startJoinTime;
let joinTimes = [];

console.time('listen  ')
server.on('connect', client => {
    joinCount++;

    startJoinTime = performance.now();
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });
});
server.on('join', async client => {
    joinTimes.push(performance.now() - startJoinTime);

    client.kick();

    if (joinCount === 3) {
        console.log(`join-1  : ${joinTimes[0].toFixed(2)}ms`)
        console.log(`join-n  : ${(joinTimes.slice(1).reduce((a, b) => a + b, 0) / joinTimes.length).toFixed(2)}ms`)

        console.time('chunks  ');
        client.chunks; // generate chunks
        console.timeEnd('chunks  ');

        //todo: add time check for <Client>.blocks

        console.time('close   ')
        await server.close();
        console.timeEnd('close   ')
    }
});
server.on('listening', () => console.timeEnd('listen  '))