module.exports = ({ expect, client, proxyClient }) => {
    client.showRespawnScreen = false;

    expect(client.showRespawnScreen, false);

    let sentChangeEvents = [];
    client.on('change', 'showRespawnScreen', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.showRespawnScreen = true;

    expect(client.showRespawnScreen, true);
    expect(sentChangeEvents, [true]);
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name === 'game_state_change' &&
        reason === 11 &&
        gameMode === 0
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.showRespawnScreen = false;

    expect(client.showRespawnScreen, false);
    expect(sentChangeEvents, [false]);
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name === 'game_state_change' &&
        reason === 11 &&
        gameMode === 1
    ), true); //

    sentChangeEvents = [];
    sentPackets = [];
    client.showRespawnScreen = false;

    expect(client.showRespawnScreen, false);
    expect(sentChangeEvents, []);
    expect(!!sentPackets.find(({ name, packet: { reason, gameMode } }) =>
        name === 'game_state_change' &&
        reason === 11 &&
        gameMode === 1
    ), true); //
}