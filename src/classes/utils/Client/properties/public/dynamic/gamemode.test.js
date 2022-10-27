const gamemodes = require('../../../../../../data/gamemodes.json');

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
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name == 'game_state_change' &&
        reason == 3 &&
        gameMode == gamemodes.indexOf('creative')
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.gamemode = 'creative';

    expect(client.gamemode, 'creative');
    expect(sentChangeEvents, []);
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name == 'game_state_change' &&
        reason == 3 &&
        gameMode == gamemodes.indexOf('creative')
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.gamemode = 'spectator';

    expect(client.gamemode, 'spectator');
    expect(sentChangeEvents, ['spectator']);
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name == 'game_state_change' &&
        reason == 3 &&
        gameMode == gamemodes.indexOf('spectator')
    ), true);

}