const changes = [ // if this is changed, make sure to also change changeEvent in Client.d.ts
    'blocks'
    'bossBars',
    'chunks',
    'difficulty',
    'entities',
    'experience',
    'food',
    'foodSaturation',
    'gamemode',
    'health',
    'inventory',
    'onGround',
    'position',
    'raining',
    'showRespawnScreen',
    'slot',
    'sneaking',
    'sprinting',
    'tabFooter',
    'tabHeader',
    'tabItems',
    'toxicRainLevel',
];

module.exports = {
    changeEvents: () => Object.fromEntries(changes.map(a => [a, []]))
}