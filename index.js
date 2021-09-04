const mc = require('./src/class');
let chunk = new (mc.Chunk)();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++) {
        for (let y = 1; y <= 99; y++)
            chunk.setBlock('dirt', { x, y, z })
        chunk.setBlock('stone', { x, y: 100, z })
    }

const server = new (mc.Server)({
    motd: {
        text: '&r&6&lHoi ik ben &nOscar',
        players: 0
    }
});

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })
    client.chunk(chunk, { x: 0, z: -1 })
    client.chunk(chunk, { x: -1, z: 0 })
    client.chunk(chunk, { x: -1, z: -1 })
    client.teleport({ x: 0, y: 120, z: 0 })
})