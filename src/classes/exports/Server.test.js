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

    console.clear()
    console.log('Starting testing server')

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

    let loggedInText = false;
    let joined = false;
    let joinedClient;
    let left = false;
    let leftClient;

    server.on('join', client => {
        if (!loggedInText) {
            console.log(`Logged in as ${client.username}`)
            loggedInText = true;
        }
        joined = true;
        joinedClient = client;
    })

    server.on('leave', client => {
        if (!loggedInText) {
            console.log(`Logged in as ${client.username}`)
            loggedInText = true;
        }
        left = true;
        leftClient = client;
    })

    await wait(1000);

    expect(joined, false);
    expect(left, false);
    expect(server.playerCount, 0);
    expect(server.server.playerCount, 0);

    let bot1Kicked = false;
    let bot1KickedReason;
    console.log('Bot 1 joining')
    await bot({
        kicked: reason => {
            bot1Kicked = true;
            bot1KickedReason = JSON.parse(reason).text;
        }
    });
    console.log('[L] Bot 1 joined test server')

    expect(joined, true);
    expect(left, false);
    expect(bot1Kicked, false);
    expect(server.playerCount, 1);
    expect(server.server.playerCount, 1);

    await wait(1000);

    expect(left, false);
    expect(bot1Kicked, false);

    console.log('[L] Bot 1 kicked')
    let random = Math.floor(Math.random() * 1000);
    joinedClient.kick(random);

    await wait(500);

    expect(left, true);
    expect(leftClient.uuid, joinedClient.uuid);
    expect(bot1Kicked, true);
    expect(bot1KickedReason, random);
    expect(server.playerCount, 0);
    expect(server.server.playerCount, 0);

    let client1 = joinedClient;
    joined = false;
    joinedClient = null;
    left = false;
    leftClient = null;

    bot1Kicked = false;
    bot1KickedReason = null;
    console.log('Bot 1 joining')
    await bot({
        kicked: reason => {
            bot1Kicked = true;
            bot1KickedReason = JSON.parse(reason).text;
        }
    });
    console.log('[L] Bot 1 joined test server')

    expect(joined, true);
    expect(left, false);
    expect(client1.uuid, joinedClient.uuid);
    expect(bot1Kicked, false);
    expect(server.playerCount, 1);
    expect(server.server.playerCount, 1);

    joined = false;
    joinedClient = null;

    let bot2Kicked = false;
    let bot2KickedReason;
    console.log('Bot 2 joining')
    await bot({
        kicked: reason => {
            bot2Kicked = true;
            bot2KickedReason = JSON.parse(reason).text;
        }
    })
    console.log('[L] Bot 2 joined test server')

    expect(joined, true);
    expect(left, false);
    expect(client1.uuid, joinedClient.uuid);
    expect(bot1Kicked, false);
    expect(bot2Kicked, false);
    expect(server.playerCount, 2);
    expect(server.server.playerCount, 2);

    console.log('Bot 2 kicked')
    random = Math.floor(Math.random() * 100);
    joinedClient.kick(random);

    await wait(500);

    expect(left, true);
    expect(bot2Kicked, true);
    expect(bot2KickedReason, random);
    expect(leftClient.uuid, client1.uuid);
    expect(server.playerCount, 1);
    expect(server.server.playerCount, 1);

    console.log('Closing test server')
    server.close();

    await wait(500);
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