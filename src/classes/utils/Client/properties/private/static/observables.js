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
    'difficulty'
].map(v => [v, []])));

module.exports = {
    observables: () => observables
}