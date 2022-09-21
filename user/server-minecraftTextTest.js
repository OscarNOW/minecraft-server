const wait = ms => new Promise(res => setTimeout(res, ms));
const { Server } = require('../');
const server = new Server();

server.on('connect', async client => {
    let ent = client.entity('drowned', client.position);

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
                    id: ent.uuid
                }
            }
        }),
        position: 0,
        sender: '0'
    })
})