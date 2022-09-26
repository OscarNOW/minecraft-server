const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');
const mc = require('minecraft-protocol');
const Server = require('./Server');
const wait = ms => new Promise(res => setTimeout(res, ms));

let credentials = null;
if (fs.existsSync(path.resolve(__dirname, `../../credentials/`)))
    if (fs.existsSync(path.resolve(__dirname, `../../credentials/microsoft.json`)))
        credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../credentials/microsoft.json`)))

module.exports = async (expect, warn) => {
    if (credentials === null) return warn(`Can't test server class without Microsoft account credentials. Create ${path.resolve(__dirname, './credentials/microsoft.json')} with username and password properties`)

    console.clear()
    console.log('Starting testing server')

    let serverPingAmount = 0;
    const server = new Server({
        serverList: ({ ip }) => {
            serverPingAmount++;

            return {
                version: {
                    wrongText: `#1#${ip}#1#`
                },
                players: {
                    online: 2,
                    max: 3,
                    hover: `#4#${ip}#4#\n#5#${ip}#5#`
                },
                description: `#6#${ip}#6#\n#7#${ip}#7#`
            }
        }
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
        console.log('[S] Bot joined test server')
        joined = true;
        joinedClient = client;
    })

    server.on('leave', client => {
        if (!loggedInText) {
            console.log(`Logged in as ${client.username}`)
            loggedInText = true;
        }
        console.log('[S] Bot left test server')
        left = true;
        leftClient = client;
    })

    await wait(1000);

    expect(joined, false);
    expect(left, false);
    expect(server.clients.length, 0);

    let bot1Kicked = false;
    let bot1KickedReason;
    console.log('Bot 1 joining')
    await bot({
        kicked: reason => {
            bot1KickedReason = reason;
            bot1Kicked = true;
        }
    });

    expect(joined, true);
    expect(left, false);
    expect(bot1Kicked, false);
    expect(server.clients.length, 1);

    await wait(1000);

    expect(left, false);
    expect(bot1Kicked, false);

    let random = `${Math.floor(Math.random() * 1000)}`;
    joinedClient.kick(random);

    await wait(500);

    expect(left, true);
    expect(leftClient.uuid, joinedClient.uuid);
    expect(bot1Kicked, true);
    expect(bot1KickedReason, random); //
    expect(server.clients.length, 0);

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
            bot1KickedReason = reason;
            bot1Kicked = true;
        }
    });
    client1 = joinedClient;

    expect(joined, true);
    expect(left, false);
    expect(client1?.uuid, joinedClient?.uuid);
    expect(bot1Kicked, false);
    expect(server?.clients.length, 1);

    joined = false;
    joinedClient = null;

    let bot2Kicked = false;
    let bot2KickedReason;
    console.log('Bot 2 joining')
    await bot({
        kicked: reason => {
            bot2Kicked = true;
            bot2KickedReason = reason;
        }
    })

    expect(joined, true);
    expect(left, false);
    expect(client1?.uuid, joinedClient?.uuid);
    expect(bot1Kicked, false);
    expect(bot2Kicked, false);
    expect(server?.clients.length, 2);

    random = `${Math.floor(Math.random() * 100)}`;
    joinedClient.kick(random);

    await wait(500);

    expect(left, true);
    expect(bot2Kicked, true);
    expect(bot2KickedReason, random); //
    expect(leftClient?.uuid, client1?.uuid);
    expect(server?.clients.length, 1);

    client1?.kick?.();

    console.log('Pinging test server')
    serverPingAmount = 0;
    let pinged = await ping();
    let ip = '::1';
    expect(serverPingAmount, 1)
    expect(pinged?.version?.name, `#1#${ip}#1#`)
    expect(pinged?.players?.online, 2)
    expect(pinged?.players?.max, 3)
    expect(pinged?.players?.sample?.[0]?.name, `#4#${ip}#4#`)
    expect(pinged?.players?.sample?.[1]?.name, `#5#${ip}#5#`)
    expect(pinged?.description, { text: `#6#${ip}#6#\n#7#${ip}#7#` })

    await wait(500);
    console.log('Closing test server');
    server.close();

    await wait(500);
}

function bot({ kicked }) {
    return new Promise(res => {
        const bot = mineflayer.createBot({
            host: 'localhost',
            username: credentials.username,
            password: credentials.password,
            auth: 'microsoft'
        })

        bot.on('chat', (username, message) => {
            console.log(`${username}: ${message}`)
        })

        bot.on('kicked', kicked)
        bot.on('login', () => setTimeout(() => res(bot), 1000));
    })
}

function ping() {
    return mc.ping({
        host: 'localhost',
        port: '25565',
        version: '1.16.3'
    })
}