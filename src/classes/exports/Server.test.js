const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');
const file = require('./Server').Server;
const wait = ms => new Promise(res => setTimeout(res, ms));

let credentials = null;
if (fs.existsSync(path.resolve(__dirname, `../../credentials/`)))
    if (fs.existsSync(path.resolve(__dirname, `../../credentials/microsoft.json`)))
        credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../credentials/microsoft.json`)))

module.exports = async (expect, warn) => {
    if (credentials === null) return warn("Can't test server without Microsoft account credentials. Create ./credentials/microsoft.json with username and password properties")

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
    let joinedClient;
    let left = false;
    let leftClient;

    server.on('join', client => {
        joined = true;
        joinedClient = client;
    })

    server.on('leave', client => {
        left = true;
        leftClient = client;
    })

    await wait(1000);

    expect(joined, false);
    expect(left, false);
    expect(server.playerCount, 0);

    let bot1Kicked = false;
    let bot1KickedReason;
    await bot({
        kicked: reason => {
            bot1Kicked = true;
            bot1KickedReason = reason;
        }
    });

    expect(joined, true);
    expect(left, false);
    expect(bot1Kicked, false);
    expect(server.playerCount, 1);

    await wait(1000);

    expect(left, false);
    expect(bot1Kicked, false);

    let random = Math.floor(Math.random() * 1000);
    joinedClient.kick(random);

    await wait(500);

    expect(left, true);
    expect(leftClient.uuid, joinedClient.uuid);
    expect(bot1Kicked, true);
    expect(bot1KickedReason, random);
    expect(server.playerCount, 0)

    let client1 = joinedClient;
    joined = false;
    joinedClient = null;
    left = false;
    leftClient = false;

    bot1Kicked = false;
    bot1KickedReason = null;
    await bot({
        kicked: reason => {
            bot1Kicked = true;
            bot1KickedReason = reason;
        }
    });

    expect(joined, true);
    expect(left, false);
    expect(client1.uuid, joinedClient.uuid);
    expect(bot1Kicked, false);
    expect(server.playerCount, 1);

    joined = false;
    joinedClient = null;

    let bot2Kicked = false;
    let bot2KickedReason;
    await bot({
        kicked: reason => {
            bot2Kicked = true;
            bot2KickedReason = reason;
        }
    })

    expect(joined, true);
    expect(left, false);
    expect(client1.uuid, joinedClient.uuid);
    expect(bot1Kicked, false);
    expect(bot2Kicked, false);
    expect(server.playerCount, 2);

    random = Math.floor(Math.random() * 100);
    joinedClient.kick(random);

    throw new Error('todo')

    server.close();
}

function bot({ kicked }) {
    return new Promise(res => {
        const bot = mineflayer.createBot({
            host: 'localhost', // minecraft server ip
            username: credentials.username, // minecraft username
            password: credentials.password, // minecraft password, comment out if you want to log into online-mode=false servers
            // port: 25565,                // only set if you need a port that isn't 25565
            version: '1.16.3',             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
            auth: 'microsoft'              // only set if you need microsoft auth, then set this to 'microsoft'
        })

        bot.on('chat', (username, message) => {
            console.log(`${username}: ${message}`)
        })

        // bot.on('playerJoined', joined)
        bot.on('kicked', kicked)
        // bot.on('error', error)
        bot.on('login', () => res(bot));
    })
}