const observables = Object.freeze(Object.fromEntries([
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
    'experience'
].map(v => [v, []])));

module.exports = {
    observables: () => observables
}