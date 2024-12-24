module.exports = ({ expect, client, proxyClient }) => {
    client.slot = 5;

    expect(client.slot, 5);

    let sentChangeEvents = [];
    client.on('change', 'slot', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentChangeEvents, [6]);
    expect(!!sentPackets.find(({ name, packet: { slot } }) =>
        name === 'held_item_slot' &&
        slot === 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentChangeEvents, []);
    expect(!!sentPackets.find(({ name, packet: { slot } }) =>
        name === 'held_item_slot' &&
        slot === 6
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 3;

    expect(client.slot, 3);
    expect(sentChangeEvents, [3]);
    expect(!!sentPackets.find(({ name, packet: { slot } }) =>
        name === 'held_item_slot' &&
        slot === 3
    ), true);

    sentChangeEvents = [];
    sentPackets = [];
    let error = false;
    try {
        client.slot = 10;
    } catch {
        error = true;
    }

    expect(error, true);
    expect(client.slot, 3);
    expect(sentChangeEvents, []);
    expect(sentPackets, []);

    sentChangeEvents = [];
    sentPackets = [];
    error = false;
    try {
        client.slot = '6';
    } catch {
        error = true;
    }

    expect(error, true);
    expect(client.slot, 3);
    expect(sentChangeEvents, []);
    expect(sentPackets, []);
}