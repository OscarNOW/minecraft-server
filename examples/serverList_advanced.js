const { Server, Text } = require('@boem312/minecraft-server');
const fs = require('fs');

const server = new Server({

    serverList: ({ ip, connection: { host, port }, version }) => ({

        description: new Text([
            { text: 'Connected through: ', color: 'gray' },
            { text: `${host}:${port}`, color: 'white', modifiers: ['bold'] },
            { text: '\nYour ip: ', color: 'gray' },
            { text: ip, color: 'white', modifiers: ['bold'] }
        ]),

        players: {
            online: server.clients.length + 5,
            max: Math.floor(Math.random() * 100) + 5,
            hover: 'More\nthan\n1\nline!'
        },

        version: {
            wrongText: 'Wrong version!',

            /*  Tell client that the correct version is their version, so they
                always think they have the correct version. Reported client
                version is null when the version of the client is unknown      */
            correct: version === null ? '1.16.3' : version
        },

        favicon: fs.readFileSync('./favicon.png')

    })

});

server.on('listening', () => console.log('Listening on localhost:25565'));