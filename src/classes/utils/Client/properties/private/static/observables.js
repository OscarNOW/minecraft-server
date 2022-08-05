const observables = [
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
    observables: () => Object.fromEntries(observables.map(a => [a, []]))
}