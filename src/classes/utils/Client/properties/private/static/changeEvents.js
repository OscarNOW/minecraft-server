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
    'onGround',
    'bossBars',
    'chunks',
    'entities',
    'sprinting',
    'tabItems',
    'tabHeader'
];

module.exports = {
    changeEvents: () => Object.fromEntries(changes.map(a => [a, []]))
}