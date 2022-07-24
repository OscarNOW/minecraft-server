const { Text, Server } = require('../');
let text = new Text([
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
    },
    {
        text: '. 12345',
        color: 'gold',
        modifiers: ['bold']
    },
    {
        text: ' Cookies',
        color: 'gold',
        modifiers: ['bold', 'italic']
    }
]);

// console.log(require('util').inspect(text.chat, { depth: null, colors: true, breakLength: 0 }));

//*
const server = new Server()

server.on('join', client => {
    client.loadWorld()

    let bossBar = client.bossBar({
        title: 'Hello'
    })

    client.on('chat', a => eval(a))
})
//*/