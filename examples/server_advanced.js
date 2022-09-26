const { Server } = require('minecraft-server')
const fs = require('fs');

const server = new Server({

    serverList: ({ ip, connection: { host, port }, version, legacy }) => ({
        description: `Hi there!\n${legacy ? "You've sent a legacy ping" : "You've sent a normal ping"}`,
        players: {
            online: server.playerCount,
            max: 100,
            hover: [ip, `${host}: ${port}`, version].join('\n')
        },
        version: {
            wrongText: 'Please use version 1.16.3',
            correct: '1.16.3'
        },
        favicon: fs.readFileSync('./favicon.png')
    }),

    wrongVersionConnect: ({ ip, connection: { host, port }, version, legacy }) =>
        `You've connected with the wrong version!\nExtra info:\nip: ${ip}, host: ${host}, port: ${port}, version: ${version}, legacy: ${legacy ? 'yes' : 'no'}`,

    defaultClientProperties: client => ({
        clearSky: true,
        difficulty: client.username == 'notch' ? 'hard' : 'normal',
        food: 20,
        foodSaturation: 5,
        gamemode: 'survival',
        health: 20,
        reducedDebugInfo: false,
        showRespawnScreen: true,
        slot: 0
    })

})