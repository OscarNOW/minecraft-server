const { Server, Text } = require('../');

const server = new Server({

    serverList: ({ legacy }) => ({

        description: [
            {
                text: 'Hello, ',
                color: 'red',
                modifiers: ['bold', 'italic']
            },
            {
                text: 'world!',
                color: 'blue',
                modifiers: ['underlined', 'strikethrough']
            }
        ],

        players: {
            online: 5,
            max: 6
        }

    })

});