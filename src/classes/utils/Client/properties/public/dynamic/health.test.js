module.exports = ({ expect, client, proxyClient }) => {
    client.health = 5;

    expect(client.health, 5);

    let sentPackets = [];
    proxyClient.onPacket((name, packet) => sentPackets.push({ name, packet }));

    sentPackets = [];
    client.health = 6;

    expect(client.health, 6);
    expect(sentPackets.find(({ name }) => name == 'update_health').packet, {
        health: 6,
        food: client.food,
        foodSaturation: client.foodSaturation
    });

    sentPackets = [];
    client.health = '2';

    expect(client.health, 2);
    expect(sentPackets.find(({ name }) => name == 'update_health').packet, {
        health: 2,
        food: client.food,
        foodSaturation: client.foodSaturation
    });

}