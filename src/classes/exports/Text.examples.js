module.exports = {
    constructor: [
        {
            code: `
const { Text, Server } = require('minecraft-server');
const message = new Text([
    {
        text: 'Hello ',
        color: 'darkGreen',
        modifiers: [
            'bold',
            'italic'
        ]
    },
    {
        text: 'world',
        color: 'purple',
        modifiers: [
            'underline',
            'strike'
        ]
    }
])

const server = new Server()

server.on('join', client => {

    // This is necessary to spawn in the client. If you don't
    // specify where to spawn it, the client will spawn at:
    // x: 0, y: 0, z: 0, yaw: 0, pitch: 0
    client.position = {}

    client.chat(message)
})
`
        }
    ]
}