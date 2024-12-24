const { Text } = require('../');

// let a = new Text([{
// text: 'true'
// }]);

let a = new Text([
    {
        translate: 'options.graphics.warning.vendor',
        color: 'darkGreen',
        with: [
            {
                translate: 'item.durability',
                color: 'green',
                modifiers: 'bold',
                with: [
                    {
                        text: 'Hello',
                        modifiers: 'bold',
                        color: 'red'
                    },
                    {
                        translate: 'options.graphics.warning.vendor',
                        color: 'purple',
                        modifiers: 'italic',
                        with: [
                            {
                                text: 'World',
                                color: 'blue'
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);

// console.log(require('util').inspect(a.array, { depth: 100, colors: true }))
console.log(require('util').inspect(a.string, { depth: 100, colors: true }))
// console.log(require('util').inspect(a.chat, { depth: 100, colors: true }))