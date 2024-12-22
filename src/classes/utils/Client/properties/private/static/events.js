const events = [
    'armSwing',
    'blockBreak',
    'blockPlace',
    'brandReceive',
    'chat',
    'connect',
    'digCancel',
    'digStart',
    'inventoryClose',
    'itemDrop',
    'itemHandSwap',
    'itemUse',
    'join',
    'leave',
    'leftClick',
    'misbehavior',
    'respawn',
    'rightClick',
    'signEditorClose',
    'windowClose'
];

module.exports = {
    events: () => Object.fromEntries(events.map(a => [a, []]))
}