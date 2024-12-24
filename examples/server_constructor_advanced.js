const { Server } = require('@boem312/minecraft-server');
const fs = require('fs');

const server = new Server({

    serverList: ({ ip, connection: { host, port }, version, legacy }) => ({
        description: `Hi there!\n${legacy ? "You've sent a legacy ping" : "You've sent a normal ping"}`,
        players: {
            online: server.clients.length,
            max: 100, // only for serverList, doesn't affect actual max clients
            hover: [ip, `${host}: ${port}`, version].join('\n')
        },
        version: {
            wrongText: 'Please use version 1.16.3',
            correct: '1.16.3' // only for serverList, doesn't affect actual correct version
        },
        favicon: fs.readFileSync('./favicon.png')
    }),

    wrongVersionConnect: ({ ip, connection: { host, port }, version, legacy }) =>
        `You've connected with the wrong version!\nExtra info:\nip: ${ip}, host: ${host}, port: ${port}, version: ${version}, legacy: ${legacy ? 'yes' : 'no'}`,

    defaultClientProperties: client => ({
        difficulty: client.username === 'notch' ? 'hard' : 'normal',
        food: 20,
        foodSaturation: 5,
        gamemode: 'survival',
        health: 20,
        reducedDebugInfo: false,
        showRespawnScreen: true,
        slot: 0
    })

});

server.on('listening', () => console.log('Listening on localhost:25565'));
server.listen();