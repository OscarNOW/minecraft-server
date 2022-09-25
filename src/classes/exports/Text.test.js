const Text = require('./Text');

module.exports = expect => {
    // parseArray
    expect(Text.parseArray([
        '',
        { text: '', color: 'green', modifiers: ['bold'] },
        { text: '', color: 'green', modifiers: ['bold', 'underlined'] },
        { text: '', color: 'blue', modifiers: [] }
    ]), [])
    expect(Text.parseArray([{ text: '', modifiers: ['bold', 'underlined'], color: 'green' }]), [])

    // stringToArray
    expect(Text.stringToArray(''), [])
    expect(Text.stringToArray('§r§r§r§r'), [])
    expect(Text.stringToArray('§r§r§r§r§nH§li§r§a§r'), [
        { color: 'default', modifiers: ['underlined'], text: 'H' },
        { color: 'default', modifiers: ['bold', 'underlined'], text: 'i' }
    ])

    // arrayToString
    expect(Text.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ]), '§r§n1§l2§r3')
    expect(Text.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ]), '§r§n1§l2§r3');

    // parseString
    expect(Text.arrayToString(Text.stringToArray('§r§r§r§r§nH§li§r§a§r§b!§k')), '§r§nH§li§r§b!')
    expect(Text.arrayToString(Text.stringToArray('§r§r§r§r§nH§li§r§a§r')), '§r§nH§li')
}