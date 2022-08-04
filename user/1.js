const { Text, Server } = require('../');
// let text = new Text([
//     {
//         text: 'hello',
//         color: 'darkRed',
//         modifiers: ['bold', 'italic']
//     },
//     {
//         text: ' people',
//         color: 'darkRed',
//         modifiers: ['italic', 'bold']
//     },
//     {
//         text: ' and world',
//         color: 'blue',
//         modifiers: ['italic', 'italic', 'bold', 'underlined']
//     },
//     {
//         text: ', people',
//         color: 'gold',
//         modifiers: ['bold', 'italic']
//     },
//     {
//         text: '. 12345',
//         color: 'gold',
//         modifiers: ['bold']
//     },
//     {
//         text: ' Cookies',
//         color: 'gold',
//         modifiers: ['bold', 'italic']
//     }
// ]);

// console.log(require('util').inspect(text.chat, { depth: null, colors: true, breakLength: 0 }));

//*
const server = new Server()

server.on('join', client => {
    client.loadWorld()

    console.log(client.bossBars)

    client.bossBar({
        title: 'Hello',
        health: 0.5
    })

    console.log(client.bossBars)

    client.bossBars[0].remove()

    console.log(client.bossBars)

    client.bossBars = 10

    console.log(client.bossBars)

})
//*/