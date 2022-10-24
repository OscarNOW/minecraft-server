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
    expect(sentPackets.find(({ name }) => name == 'update_health').packet, {
        health: 6,
        food: client.food,
        foodSaturation: client.foodSaturation
    });

    //todo: add test for setting twice

    sentChangeEvents = [];
    sentPackets = [];
    client.health = '12';

    expect(client.health, 12);
    expect(sentChangeEvents, [12]);
    expect(sentPackets.find(({ name }) => name == 'update_health').packet, {
        health: 12,
        food: client.food,
        foodSaturation: client.foodSaturation
    });

}