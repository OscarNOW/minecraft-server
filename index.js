const mc = require('./src/class');
const chunkLoad = 7;
const wait = ms => new Promise(res => setTimeout(res, ms));
let chunk = new (mc.Chunk)();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++) {
        for (let y = 1; y <= 98; y++)
            chunk.setBlock('stone', { x, y, z })
        for (let y = 98; y <= 99; y++)
            chunk.setBlock('dirt', { x, y, z })
        chunk.setBlock('grass_block', { x, y: 100, z })
    }

const server = new (mc.Server)({
    motd: {
        text: '&r&6&lHoi ik ben &nOscar',
        players: 0
    }
});

server.on('join', client => {

    setTimeout(() => {
        client.teleport({ x: 0, y: 120, z: 0 });
    }, 1800);

    client.chat(`§r§6§l${client.username}§r§e joined the game`)
    client.on('chat', message => {
        client.chat(`§r§6§l${client.username}§r§6: §r§7${message}`)
    })

    let loadedChunks = [];
    loadedChunks.push('0;0')
    client.chunk(chunk, { x: 0, z: 0 })
    client.on('move', () => {
        for (let xOffset = -chunkLoad; xOffset <= chunkLoad; xOffset++)
            for (let zOffset = -chunkLoad; zOffset <= chunkLoad; zOffset++) {

                let chunkX = Math.floor(client.position.x / 16) + xOffset;
                let chunkZ = Math.floor(client.position.z / 16) + zOffset;

                if (!loadedChunks.includes(`${chunkX};${chunkZ}`)) {
                    loadedChunks.push(`${chunkX};${chunkZ}`)
                    client.chunk(chunk, { x: chunkX, z: chunkZ })
                }

            }
    })

    client.on('command', message => {
        if (message.startsWith('tp')) {

            let coords = message.split(' ').slice(1);
            client.teleport({ x: coords[0], y: coords[1], z: coords[2] })

        } else if (message.startsWith('summon')) {

            let entityType = message.split(' ').slice(1)[0];
            let coords = message.split(' ').slice(2);
            client.entity(entityType, { x: coords[0], y: coords[1], z: coords[2] });

        } else {
            return client.chat('Unknown command');
        }
    })
})