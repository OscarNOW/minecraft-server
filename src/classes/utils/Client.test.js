const fs = require('fs');
const path = require('path');

const Server = require('../exports/Server.js');
const ProxyClient = require('../exports/ProxyClient.js');

module.exports = (expect, warn) => {
    return new Promise(async res => {
        const server = new Server();
        const proxyClient = new ProxyClient();

        server.on('connect', client => {
            let cleanUp = () => cleanup({ server, client, proxyClient });

            for (const [testFileFunction, testFileName] of
                fs
                    .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
                    .filter(v => v.endsWith('.test.js'))
                    .map(v => [require(`./Client/properties/public/dynamic/${v}`), v.split('.')[0]])
            ) {
                let count = 0;

                try {
                    testFileFunction({
                        expect: (a, b) => {
                            expect(a, b, `${testFileName}-${count}`);
                            count++;
                        },
                        warn,
                        server,
                        proxyClient,
                        client,
                        cleanUp
                    });
                } catch (e) {
                    console.error(e);
                    expect(e, 'no error', testFileName);
                }
                cleanup({ client, proxyClient });
            }

            server.close();

            res();
        });

        proxyClient.onPacket(name => {
            if (name === 'login')
                proxyClient.sendPacket('settings', {
                    locale: 'en_us',
                    viewDistance: 10,
                    chatFlags: 0,
                    chatColors: true,
                    skinParts: 127,
                    mainHand: 1
                })
        })

        await server.listen();
        server.joinProxyClient(proxyClient);
    });
}

function cleanup({ client, proxyClient }) {
    proxyClient.removeAllListeners();
    client.removeAllListeners();
}