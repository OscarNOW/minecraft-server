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
    'misbehavior'
];

module.exports = {
    changeEvents: () => Object.fromEntries(events.map(a => [a, []]))
}