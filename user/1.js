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

    await wait(2000);

    bossBar.color = 'purple'

    await wait(2000);

    bossBar.divisionAmount = 10;
})