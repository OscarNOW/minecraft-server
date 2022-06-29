module.exports = {
    particle: [
        {
            code: `
client.particle(
    'dust',
    true,
    100,
    client.position,
    { x: 1, y: 1, z: 1 },
    {
        red: 64,
        green: 73,
        blue: 82
    },
    1
);
`
        }
    ]
}