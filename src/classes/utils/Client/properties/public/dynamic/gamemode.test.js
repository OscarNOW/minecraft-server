module.exports = ({ expect, client, proxyClient }) => {
    client.gamemode = 'survival';

    expect(client.gamemode, 'survival');

    let sentChangeEvents = [];
    client.on('change', 'gamemode', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.gamemode = 'creative';

    expect(client.gamemode, 'creative');
    expect(sentChangeEvents, ['creative']);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        reason: 3,
        gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf('creative')
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.gamemode = 'creative';

    expect(client.gamemode, 'creative');
    expect(sentChangeEvents, []);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        reason: 3,
        gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf('creative')
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.gamemode = 'spectator';

    expect(client.gamemode, 'spectator');
    expect(sentChangeEvents, ['spectator']);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        reason: 3,
        gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf('spectator')
    });

}