const { Server, Chunk } = require('../');
console.log('Loaded library')

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 5,
            y: 101,
            z: 5
        }
    })
});

console.log('Listening')
server.on('connect', async client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.tabHeader = {
        text: 'Header hello',
        color: 'green',
        modifiers: ['bold', 'italic']
    };

    client.tabFooter = {
        text: 'Footer hello',
        color: 'red',
        modifiers: ['underlined', 'strikethrough']
    };

    client.tabItem({
        name: 'Notch'
    })
});