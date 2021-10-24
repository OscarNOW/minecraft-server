const mineflayer = require('mineflayer')
const file = require('./Server').Server;
const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports = async expect => {
    const server = new file({
        serverList: ip => ({
            versionMessage: `#1#${ip}#1#`,
            players: {
                online: 2,
                max: 3,
                hover: `#4#${ip}#4#\n#5#${ip}#5#`
            },
            description: `#6#${ip}#6#\n#7#${ip}#7#`
        })
    });

    let joined = false;
    let left = false;

    server.on('join', client => {
        joined = true;
    })

    server.on('leave', client => {
        left = true;
    })

    await wait(1000);

    expect(joined, false);
    expect(left, false);



    server.close();
}

function bot({ joined, kicked, error }) {
    return new Promise(res => {
        const bot = mineflayer.createBot({
            host: 'localhost', // minecraft server ip
            username: 'Blocked', // minecraft username
            password: 'Blocked', // minecraft password, comment out if you want to log into online-mode=false servers
            // port: 25565,                // only set if you need a port that isn't 25565
            version: '1.16.3',             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
            auth: 'microsoft'              // only set if you need microsoft auth, then set this to 'microsoft'
        })

        bot.on('chat', (username, message) => {
            console.log(`${username}: ${message}`)
        })

        bot.on('login', () => res(bot));
        bot.on('playerJoined', joined)
        bot.on('kicked', kicked)
        bot.on('error', error)
    })
}