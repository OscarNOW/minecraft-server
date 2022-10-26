module.exports = ({ expect, client, proxyClient }) => {
    client.health = 5;

    expect(client.health, 5);

    let sentChangeEvents = [];
    client.on('change', 'health', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.health = 6;

    expect(client.health, 6);
    expect(sentChangeEvents, [6]);
    expect(!!sentPackets.find(({ name, packet: { health } }) =>
        name == 'update_health' &&
        health == 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.health = 6;

    expect(client.health, 6);
    expect(sentChangeEvents, []);
    expect(!!sentPackets.find(({ name, packet: { health } }) =>
        name == 'update_health' &&
        health == 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.health = '23';

    expect(client.health, 20);
    expect(sentChangeEvents, [20]);
    expect(!!sentPackets.find(({ name, packet: { health } }) =>
        name == 'update_health' &&
        health == 20
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.health = '-2';

    expect(client.health, 0);
    expect(sentChangeEvents, [0]);
    expect(!!sentPackets.find(({ name, packet: { health } }) =>
        name == 'update_health' &&
        health == 0
    ), true);

}