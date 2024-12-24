const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 90; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

const server = new Server({
    defaultClientProperties: () => ({
        gamemode: 'creative',
        position: {
            x: 1,
            y: 100,
            z: 3
        }
    })
});

server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.p.sendPacket('spawn_entity_living', {
        entityId: 465992,
        entityUUID: '33747b7b-5355-47f7-b106-ebc92bbdc8d6',
        type: 93,
        x: 76.25,
        y: 95,
        z: -15.03125,
        yaw: 93,
        pitch: 0,
        headPitch: 93,
        velocityX: 0,
        velocityY: -627,
        velocityZ: 0
    });

    client.p.sendPacket('player_info', {
        action: 0,
        data: [
            {
                UUID: '33747b7b-5355-47f7-b106-ebc92bbdc8d6',
                name: 'Rumonum',
                properties: [
                    {
                        name: 'textures',
                        value: 'ewogICJ0aW1lc3RhbXAiIDogMTcyNjA3OTI0MjY1MiwKICAicHJvZmlsZUlkIiA6ICIzMzc0N2I3YjUzNTU0N2Y3YjEwNmViYzkyYmJkYzhkNiIsCiAgInByb2ZpbGVOYW1lIiA6ICJSdW1vbnVtIiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzEyOTgxODEwMDUzYjY3MTJlODU5ZjA3YmVmNDMwMDQ1OTViYmE3ZWVlMjkxN2Y2OTE0YmZkZGNlNWJmNTlhMzciCiAgICB9CiAgfQp9',
                        signature: 'mYMOiknsrBDaHTJPKbhHW141YZCs1Yq7unLuUgKgVep5j0MFH8VgtwMeyYz0ONKgC/9rOrEDaCrIIt/rYCC3A+kpAyfQeIfqVBW2cqQuM6iQj1n6y9jJSiCqDq5JqUFurJr/JTSrOf7GbBs/jEU0l+bEvL9WrTytRs3c/mMaJkEGdQi0+Ay3zx7xXuahLaQJm6C8M+HN6aUJirdMGCTZvoZmeZDNALZ2Vw8uJBRoRhiaPzqsmKXzUaaNZ3RrZ9WqbFOYhxQIYo+ScBCLpxEq9BL6LhKaB9Z/qsX010l36GJIw2lYi3YgRJsqcObAYqlRXT0NBz6yYaVK5QeQa40ycF03xTGKNboE4xPnmYQVHxM+bAS47INeQqxtVgR6zDUVhBYATlV0Vx831bPRLFLLFuxZdm2ffb6eetFuamG8J9bmQ/CDGIjpcQbgtpwnVsb3smkcQGnJikQr3x1vbprBEG2v8s8Vl96mgKqRCjdzcApeh6OjdPOrXuzPJdCRd+BmCTQrwBzhos4e01u8UAK2guhPLMfbz5JBuVoAHBW++zxVciGDt+yj8oKVfrRoZ7OxxSF8ytNjVDGJdtGCmtVfii7EKZzk3VJULfAERTV/qmkde0N45zZMPOh0RuGY//hQV+iLCkaZfIgFdVP7qLZOv9nfYxCcp7KfHIAUphDpZOU='
                    }
                ],
                gamemode: 2,
                ping: 129
            }
        ]
    });

    client.p.sendPacket('named_entity_spawn', {
        entityId: 465992,
        playerUUID: '33747b7b-5355-47f7-b106-ebc92bbdc8d6',
        x: 0.9375,
        y: 102,
        z: -10.40625,
        yaw: -126,
        pitch: 0
    });
});

server.on('listening', () => console.log('Listening'));
server.listen();