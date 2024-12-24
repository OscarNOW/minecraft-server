const { Server, ProxyClient } = require('../');

let proxyClient = new ProxyClient();
proxyClient.onPacket((name, packet) => {
    if (name === 'map_chunk')
        console.log('<-', name, '...');
    else
        console.log('<-', name, packet);

    if (name === 'login')
        proxyClient.sendPacket('settings', {
            locale: 'en_US',
            viewDistance: 8,
            chatFlags: 0,
            chatColors: true,
            skinParts: 0,
            mainHand: 0
        })
});

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 5,
            y: 101,
            z: 5
        }
    })
});

server.on('connect', client => {
    client.on('misbehavior', a => console.log(a.toString()))
});

server.on('listening', () => console.log('Listening'));
server.listen().then(() => server.joinProxyClient(proxyClient));