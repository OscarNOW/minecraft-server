const Text = require('./Text');

module.exports = expect => {
    expect(Text.stringToArray(''), [])
    expect(Text.parseArray([
        '',
        { text: '', color: 'green', modifiers: ['bold'] },
        { text: '', color: 'green', modifiers: ['bold', 'underlined'] },
        { text: '', color: 'blue', modifiers: [] }
    ]), [])
    expect(Text.stringToArray('§r§r§r§r'), [])
    expect(Text.parseArray([{ text: '', modifiers: ['bold', 'underlined'], color: 'green' }]), [])
    expect(Text.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ]), '§r§n1§l2§r3')
    expect(Text.arrayToString(Text.stringToArray('§r§r§r§r§nH§li§r§a§r§b!§k')), '§r§nH§li§r§b!')

    let o = new Text([{ text: 'hi', modifiers: ['bold'], color: 'green' }]);
    expect(o.string, '§r§a§lhi')

    o.array = [
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ];
    expect(o.string, '§r§n1§l2§r3')

    o.string = '§r§r§r§r§nH§li§r§a§r';
    expect(o.string, '§r§nH§li') //9
    expect(o.array, [
        { text: 'H', color: 'default', modifiers: ['underlined'] },
        { text: 'i', color: 'default', modifiers: ['bold', 'underlined'] }
    ]) //10
}