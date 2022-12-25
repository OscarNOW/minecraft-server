const { Server } = require('@boem312/minecraft-server');
const server = new Server({

    serverList: ({ ip }) => ({

        description: `A minecraft server\nYour ip is ${ip}`,
        players: {
            online: server.clients.length,
            max: 100
        },
        version: {
            wrongText: 'Please use 1.16.3'
        }

    })

});