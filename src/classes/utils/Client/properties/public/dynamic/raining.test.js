module.exports = ({ expect, client, proxyClient }) => {
    client.raining = false;

    expect(client.raining, false);

    let sentChangeEvents = [];
    client.on('change', 'raining', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.raining = true;

    expect(client.raining, true);
    expect(sentChangeEvents, [true]);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 1
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.raining = false;

    expect(client.raining, false);
    expect(sentChangeEvents, [false]);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 0
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.raining = false;

    expect(client.raining, false);
    expect(sentChangeEvents, []);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 0
    });
}