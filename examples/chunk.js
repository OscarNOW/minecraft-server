const { Chunk } = require('minecraft-server')
let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'grass_block', { snowy: false });