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
    client.position = {}

    client.chat(message)
})
`
        }
    ]
}