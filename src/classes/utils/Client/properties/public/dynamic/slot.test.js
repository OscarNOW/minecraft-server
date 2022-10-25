module.exports = ({ expect, client, proxyClient }) => {
    client.slot = 5;

    expect(client.slot, 5);

    let sentChangeEvents = [];
    client.on('change', 'raining', v => sentChangeEvents.push(v))

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentChangeEvents, [6]);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 6
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentChangeEvents, []);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 6
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = '2';

    expect(client.slot, 2);
    expect(sentChangeEvents, [2]);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 2
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = 10;

    expect(client.slot, 1);
    expect(sentChangeEvents, [1]);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 1
    });

    sentChangeEvents = [];
    sentPackets = [];
    client.slot = '12';

    expect(client.slot, 3);
    expect(sentChangeEvents, [3]);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 3
    });

}