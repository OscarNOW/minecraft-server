const changes = [
    'position',
    'slot',
    'health',
    'food',
    'foodSaturation',
    'raining',
    'toxicRainLevel',
    'showRespawnScreen',
    'gamemode',
    'difficulty',
    'experience',
    'sneaking',
    'onGround'
];

module.exports = {
    changeEvents: () => Object.fromEntries(changes.map(a => [a, []]))
}