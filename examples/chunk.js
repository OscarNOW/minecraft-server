const { Chunk } = require('@boem312/minecraft-server')
let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('grass_block', { x, y, z }, { snowy: false });