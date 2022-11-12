module.exports = ({ expect, client, proxyClient }) => {
    client.food = 5;

    expect(client.food, 5);

    let sentChangeEvents = [];
    client.on('change', 'food', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.food = 6;

    expect(client.food, 6);
    expect(sentChangeEvents, [6]);
    expect(!!sentPackets.find(({ name, packet: { food } }) =>
        name === 'update_health' &&
        food === 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.food = 6;

    expect(client.food, 6);
    expect(sentChangeEvents, []);
    expect(!!sentPackets.find(({ name, packet: { food } }) =>
        name === 'update_health' &&
        food === 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.food = '23';

    expect(client.food, 20);
    expect(sentChangeEvents, [20]);
    expect(!!sentPackets.find(({ name, packet: { food } }) =>
        name === 'update_health' &&
        food === 20
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.food = '-2';

    expect(client.food, 0);
    expect(sentChangeEvents, [0]);
    expect(!!sentPackets.find(({ name, packet: { food } }) =>
        name === 'update_health' &&
        food === 0
    ), true);

}