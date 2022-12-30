const events = [
    'chat',
    'digStart',
    'digCancel',
    'blockBreak',
    'itemDrop',
    'itemHandSwap',
    'leftClick',
    'rightClick',
    'connect',
    'join',
    'leave',
    'signEditorClose',
    'windowClose',
    'itemUse',
    'inventoryClose',
    'misbehavior',
    'blockPlace',
    'armSwing',
    'respawn',
    'brandReceive'
];

module.exports = {
    events: () => Object.fromEntries(events.map(a => [a, []]))
}