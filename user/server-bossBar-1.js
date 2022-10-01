const { Server } = require('../')
const server = new Server();

const wait = ms => new Promise(res => setTimeout(res, ms));

server.on('join', async client => {
    let bossBar = client.bossBar({
        title: 'Test',
        health: 0.75,
        color: 'pink',
        divisionAmount: 10
    })

    // await wait(2000);

    // client.chat(1)
    // bossBar.color = 'purple'
    // bossBar.color = 'pink'

    // await wait(2000);

    // client.chat(2)
    // bossBar.divisionAmount = 10;
})