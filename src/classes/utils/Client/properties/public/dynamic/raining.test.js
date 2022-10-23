module.exports = ({ expect, client, proxyClient }) => {
    client.raining = false;

    expect(client.raining, false);

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentPackets = [];
    client.raining = true;

    expect(client.raining, true);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 1
    });

    sentPackets = [];
    client.raining = false;

    expect(client.raining, false);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 0
    });

    sentPackets = [];
    client.raining = false;

    expect(client.raining, false);
    expect(sentPackets.find(({ name }) => name == 'game_state_change').packet, {
        reason: 7,
        gameMode: 0
    });
}