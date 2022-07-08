const { Server } = require('../')
const server = new Server();

const wait = ms => new Promise(res => setTimeout(res, ms));

server.on('join', async client => {
    client.position = {}
    client.on('chat', a => eval(a))

    let bossBar = client.bossBar({
        title: 'Test',
        health: 0.75,
        color: 'pink',
        divisionAmount: 10
    })

    await wait(1000);

    bossBar.title = 'Hi'

    await wait(1000);

    bossBar.health = 0.5

    await wait(1000);

    bossBar.color = 'purple'

    await wait(1000);

    for (let ii = 0; true; ii++) {
        if (client.bossBars.length > 4) client.bossBars[0].remove();

        client.bossBar({
            title: '',
            health: Math.floor(Math.random() * 10) / 10,
            color: ['pink', 'blue', 'red', 'green', 'yellow', 'purple', 'white'][Math.floor(Math.random() * 7)],
            divisionAmount: [0, 6, 10, 12, 20][Math.floor(Math.random() * 5)]
        })

        await wait(500);
    }
})