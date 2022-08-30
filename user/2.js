const { Text } = require('../');

/*
let a = Text.arrayToChat([
    {
        text: 'Hello',
        color: 'darkRed',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.google.com'
        }
    },
    {
        text: ' world',
        color: 'darkGreen',
        clickEvent: {
            action: 'open_url',
            value: 'https://www.google.com'
        }
    }
])

console.log(a)
//*/

//*
const wait = ms => new Promise(res => setTimeout(res, ms));
const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    let ent = client.entity('zombie', client.position);

    await wait(1000);
    console.log(ent.uuid)

    client.raw('chat', {
        message: JSON.stringify({
            text: 'Hello',
            hoverEvent: {
                "action": "show_entity",
                "contents": {
                    "name": {
                        "text": "johnny sins"
                    },
                    "type": "minecraft:drowned",
                    id: "11cdf7cf-6dc0-4b6f-9e87-e06fd2377ce8"
                }
            }
        }),
        position: 0,
        sender: '0'
    })
})
//*/