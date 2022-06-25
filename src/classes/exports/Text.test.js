const Text = require('./Text').Text;

module.exports = expect => {
    expect(Text.stringToArray(''), [])
    expect(Text.parseArray([
        '',
        { text: '', color: 'green', modifiers: ['bold'] },
        { text: '', color: 'green', modifiers: ['bold', 'underline'] },
        { text: '', color: 'blue', modifiers: [] }
    ]), [])
    expect(Text.stringToArray('§r§r§r§r'), [])
    expect(Text.parseArray([{ text: '', modifiers: ['bold', 'underline'], color: 'green' }]), [])
    expect(Text.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underline'] },
        { text: '2', color: 'default', modifiers: ['underline', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ]), '§r§n1§l2§r3')
    expect(Text.parseString('§r§r§r§r§nH§li§r§a§r§b!§k'), '§r§nH§li§r§b!')

    let o = new Text([{ text: 'hi', modifiers: ['bold'], color: 'green' }]);
    expect(o.string, '§r§a§lhi')

    o.array = [
        { text: '1', color: 'default', modifiers: ['underline'] },
        { text: '2', color: 'default', modifiers: ['underline', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ];
    expect(o.string, '§r§n1§l2§r3')

    o.string = '§r§r§r§r§nH§li§r§a§r';
    expect(o.string, '§r§nH§li')
    expect(o.array, [
        { text: 'H', color: 'default', modifiers: ['underline'] },
        { text: 'i', color: 'default', modifiers: ['underline', 'bold'] }
    ])
}