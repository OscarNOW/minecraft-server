const { Chunk, Server, Text } = require('./');

let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++) {
        for (let y = 0; y <= 100; y++)
            chunk.setBlock({ x, y, z }, 'dirt')
    }

const server = new Server({
    serverList: ({ ip, version, connection: { host, port }, legacy }) => ({
        version: {
            wrongText: 'Use 1.16.3',
            correct: legacy ? '1.6.4' : '1.16.3'
        },
        players: {
            online: 0,
            max: 0,
            hover: `ip: ${ip}\nversion: ${version}\nhost: ${host}\nport: ${port}\nlegacy: ${legacy}`
        },
        description: new Text([{ text: legacy ? `${ip} ${version} ${host} ${port}` : `Beautiful server`, color: 'green', modifiers: ['bold', 'underline'] }])
    }),
    wrongVersionConnect: ({ ip, version, connection: { host, port }, legacy }) => new Text([{ text: `Wrong version\nip: ${ip}\nversion: ${version}\nhost: ${host}\nport: ${port}\nlegacy: ${legacy}`, color: 'green', modifiers: ['bold', 'italic'] }]),
    defaultClientProperties: client => ({
        gamemode: 'creative',
        difficulty: 'easy'
    })
});

server.on('join', client => {
    let horse = client.entity('horse', { x: 10, y: 101, z: 10, yaw: 0, pitch: 0 });

    client.on('chat', a => eval(a))

    setTimeout(() => {
        client.position = {
            x: 0,
            y: 120,
            z: 0,
            yaw: 0,
            pitch: 0
        };
    }, 3000); //Look if client sends packet when ready to be teleported, instead of arbitrary wait

    for (let x = -7; x < 7; x++)
        for (let z = -7; z < 7; z++)
            client.chunk(chunk, { x, z })
});