const { Server, Text } = require('../');

const server = new Server({

    serverList: ({ ip, connection: { host, port }, version, legacy }) => ({

        description: new Text([
            { text: `Connected through: `, color: 'gray' },
            { text: `${host}:${port}`, color: 'white', modifiers: ['bold'] },
            { text: `\nYour ip: `, color: 'gray' },
            { text: ip, color: 'white', modifiers: ['bold'] }
        ]),

        players: {
            online: server.clients.length,
            max: Math.floor(Math.random() * 100) + 5,
            hover: `Legacy:\n${legacy ? 'Yes' : 'No'}\n\nVersion:\n${version}`
        },

        version: {
            wrongText: 'Wrong version!',

            /*  Tell client that the correct version is their version, so they
                always think they have the correct version. Client version is null
                when the version of the client is unknown                           */
            correct: version === null ? '1.16.3' : version
        }

    })

});