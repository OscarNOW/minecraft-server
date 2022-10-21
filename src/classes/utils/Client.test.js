const fs = require('fs');
const path = require('path');

const Server = require('../exports/Server.js');
const ProxyClient = require('../exports/ProxyClient.js');

module.exports = (expect, warn) => {
    return new Promise(res => {
        const server = new Server();
        const proxyClient = new ProxyClient();

        server.on('connect', client => {
            for (const test of
                fs
                    .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
                    .filter(v => v.endsWith('.test.js'))
                    .map(v => require(`./Client/properties/public/dynamic/${v}`))
            ) {
                test({ expect, warn, server, proxyClient, client });
                proxyClient.removeAllListeners();
            }

            server.close();

            res();
        });

        proxyClient.onPacket(name => {
            if (name == 'login')
                proxyClient.sendPacket('settings', {
                    locale: 'en_us',
                    viewDistance: 10,
                    chatFlags: 0,
                    chatColors: true,
                    skinParts: 127,
                    mainHand: 1
                })
        })

        server.joinProxyClient(proxyClient);

    })
}