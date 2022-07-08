const { Server } = require('../')
const server = new Server();

server.on('join', client => {
    client.on('chat', a => eval(a))

    let horse = client.entity('horse', { x: 5, y: 101, z: 10, yaw: 0, pitch: 0 })
    client.observe('slot', () => {
        client.sound({
            sound: 'music.creative',
            channel: 'music',
            position: {
                x: client.position.x + 5,
                y: client.position.y,
                z: client.position.z
            },
            volume: 1,
            pitch: 1
        })
    })

    client.position = {}
})