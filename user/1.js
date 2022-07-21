const { Text, Server } = require('../');
const text = Text.arrayToChat([
    {
        text: 'hello',
        color: 'darkRed',
        modifiers: ['bold', 'italic']
    },
    {
        text: ' people',
        color: 'darkRed',
        modifiers: ['italic', 'bold']
    },
    {
        text: ' and world',
        color: 'blue',
        modifiers: ['italic', 'italic', 'bold', 'underlined']
    },
    {
        text: ', people',
        color: 'gold',
        modifiers: ['bold', 'italic']
    }
])

const server = new Server()
server.on('join', client => {
    client.chat(0, text)

    client.loadWorld()
})