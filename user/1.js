const { Text } = require('../');
console.log(require('util').inspect(
    Text.arrayToChat([
        {
            text: 'hello',
            color: 'darkRed',
            modifiers: ['bold', 'italic']
        },
        {
            text: ' world',
            color: 'blue',
            modifiers: ['italic', 'italic', 'bold', 'underline']
        },
        {
            text: ', people',
            color: 'gold',
            modifiers: ['bold', 'italic']
        }
    ])
    , { showHidden: false, depth: null, colors: true, breakLength: 1 }));