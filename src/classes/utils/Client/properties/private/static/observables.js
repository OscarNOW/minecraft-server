const observables = Object.freeze(Object.fromEntries([
    'position',
    'slot',
    'health',
    'food',
    'foodSaturation',
    'darkSky',
    'respawnScreen',
    'gamemode',
    'difficulty'
].map(v => [v, []])));

module.exports = {
    observables: () => observables
}