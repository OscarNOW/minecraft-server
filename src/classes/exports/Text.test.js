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
    expect(Text.parseArray([{ text: 'Hello world', insertion: '' }]), [{ color: 'default', modifiers: [], text: 'Hello world' }])

    //arrayToChat
    expect(Text.arrayToChat([{
        text: 'Hello world',
        clickEvent: { action: 'open_url', value: 'https://google.com' }
    }]), { text: 'Hello world', clickEvent: { action: 'open_url', value: 'https://google.com' } })
    expect(Text.arrayToChat([{
        text: 'Hello world',
        hoverText: 'Hello world'
    }]), { text: 'Hello world', hoverEvent: { action: 'show_text', value: 'Hello world' } })
    expect(Text.arrayToChat({
        translate: 'demo.help.movementShort',
        with: [
            'w',
            'a',
            's',
            'd'
        ]
    }), {
        translate: 'demo.help.movementShort',
        with: [
            'w',
            'a',
            's',
            'd'
        ]
    })
    expect(Text.arrayToChat([{
        text: 'true'
    }]), true)
    expect(Text.arrayToChat(0), 0)
    expect(Text.arrayToChat(1), 1)
    expect(Text.arrayToChat(10), 10)
    expect(Text.arrayToChat(true), true)
    expect(Text.arrayToChat(false), false)

    // arrayToString
    expect(Text.arrayToString([{ text: 'hi', modifiers: ['bold'], color: 'green' }]), '§r§a§lhi')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] }
    ]), '§r§n1§l2§r3')
    expect(Text.arrayToString([
        { text: '1', color: 'default', modifiers: ['underlined'] },
        { text: '2', color: 'default', modifiers: ['underlined', 'bold'] },
        { text: '3', color: 'default', modifiers: [] }
    ]), '§r§n1§l2§r3');
    expect(Text.arrayToString([{
        translate: 'demo.help.movementShort',
        with: [
            'Foo',
            'Bar',
            'Baz',
            'Fooz'
        ]
    }]), '§rMove by pressing the Foo, Bar, Baz, Fooz keys')

    // stringToArray
    expect(Text.stringToArray(''), [])
    expect(Text.stringToArray('§r§r§r§r'), [])
    expect(Text.stringToArray('§r§r§r§r§nH§li§r§a§r'), [
        { color: 'default', modifiers: ['underlined'], text: 'H' },
        { color: 'default', modifiers: ['bold', 'underlined'], text: 'i' }
    ])

    // parseString
    expect(Text.arrayToString(Text.stringToArray('§r§r§r§r§nH§li§r§a§r§b!§k')), '§r§nH§li§r§b!')
    expect(Text.arrayToString(Text.stringToArray('§r§r§r§r§nH§li§r§a§r')), '§r§nH§li')

    //setting
    let temp = new Text('');
    temp.string = 'Hello world!';
    expect(temp.string, '§rHello world!')
    expect(temp.array, [{ color: 'default', modifiers: [], text: 'Hello world!' }])
    expect(temp.uncolored, 'Hello world!')
    expect(temp.chat, 'Hello world!')

    temp = new Text('')
    temp.array = 'Foo bar 123';
    expect(temp.string, '§rFoo bar 123')
    expect(temp.array, [{ text: 'Foo bar 123', color: 'default', modifiers: [] }])
    expect(temp.uncolored, 'Foo bar 123')
    expect(temp.chat, 'Foo bar 123')
}