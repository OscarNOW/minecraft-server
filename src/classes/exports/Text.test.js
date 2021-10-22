const t = require('./Text').Text;

module.exports = expect => {
    expect(t.stringToArray(''), [])
    expect(t.parseArray([
        '',
        { text: '', color: 'green', modifiers: ['bold'] },
        { text: '', color: 'green', modifiers: ['bold', 'underline'] },
        { text: '', color: 'blue', modifiers: [] }
    ]), [])
    expect(t.stringToArray('§r§r§r§r'), [])
    expect(t.parseArray([{ text: '', modifiers: ['bold', 'underline'], color: 'green' }]), [])
    expect(t.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(t.arrayToString([
        { text: '1', color: 'default', modifiers: ['underline'] },
        { text: '2', color: 'default', modifiers: ['underline', 'bold'] },
        { text: '3', color: 'default', modifiers: [] },
    ]), '§r§n1§l2§r3')
    expect(t.parseString('§r§r§r§r§nH§li§r§a§r§b!§k'), '§r§nH§li§r§b!')
}