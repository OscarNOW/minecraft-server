const { Server, Chunk } = require('../')
const server = new Server();
let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')

server.on('join', client => {
    client.chunk(chunk, { x: 0, z: 0 })
    client.on('chat', a => eval(a))
    client.position = {
        x: 3,
        y: 102,
        z: 3
    }

    let horse = client.entity('horse', { x: 5, y: 101, z: 10, yaw: 0, pitch: 0 })
    client.observe('slot', slot => {
        if (slot == 0)
            client.stopSounds({
                channel: 'friendlyCreature'
            })
        else
            horse.sound({
                sound: 'entity.cow.ambient',
                channel: 'friendlyCreature',
                volume: 1,
                pitch: 1
            })
    })
})