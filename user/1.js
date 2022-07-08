const { Server } = require('../')
const server = new Server();

server.on('join', client => {
    client.on('chat', a => eval(a))
    client.position = {}

    client.observe('slot', () => {
        client.sound({
            sound: 'music.dragon',
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
})