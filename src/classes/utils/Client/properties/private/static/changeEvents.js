const changes = [ // if this is changed, make sure to also change changeEvent in Client.d.ts
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
    'tabHeader',
    'tabFooter',
    'inventory',
    'blocks'
];

module.exports = {
    changeEvents: () => Object.fromEntries(changes.map(a => [a, []]))
}