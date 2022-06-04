const { Chunk, Server, Text } = require('./src/index');

let chunk = new Chunk();

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++) {
        for (let y = 1; y <= 98; y++)
            chunk.setBlock('stone', { x, y, z })
        for (let y = 98; y <= 99; y++)
            chunk.setBlock('dirt', { x, y, z })
        chunk.setBlock('grass_block', { x, y: 100, z })
    }

const server = new Server({
    serverList: ({ ip, version }) => ({
        version: {
            wrongText: 'Please use version 1.16.3',
            correct: '1.16.3'
        },
        players: {
            online: 0,
            max: 0,
            hover: 'Hi\n2\n3'
        },
        description: `ip: ${ip}\nversion: ${version}`
    }),
    wrongVersionConnect: ({ version, ip }) => `Please use 1.16.3!\nYour version: ${version}\nYour ip: ${ip}`
});

server.on('join', client => {
    client.difficulty = 'easy'
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