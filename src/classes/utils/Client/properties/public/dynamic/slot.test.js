module.exports = ({ expect, client, proxyClient }) => {
    client.slot = 5;

    expect(client.slot, 5);

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 6
    });

    sentPackets = [];
    client.slot = 6;

    expect(client.slot, 6);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 6
    });

    sentPackets = [];
    client.slot = '2';

    expect(client.slot, 2);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 2
    });

    sentPackets = [];
    client.slot = 11;

    expect(client.slot, 2);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 2
    });

    sentPackets = [];
    client.slot = '12';

    expect(client.slot, 3);
    expect(sentPackets.find(({ name }) => name == 'held_item_slot').packet, {
        slot: 3
    });

}