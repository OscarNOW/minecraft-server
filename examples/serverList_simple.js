const { Server } = require('minecraft-server');
const server = new Server({

    serverList: ({ ip }) => ({

        description: `My server\nYour ip is ${ip}`,
        players: {
            online: server.playerCount,
            max: 100
        },
        version: {
            wrongText: 'Please use 1.16.3'
        }

    })

})