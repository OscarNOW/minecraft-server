const fs = require('fs');
const path = require('path');

module.exports = {
    chatTranslate: Object.keys(
        JSON.parse(fs
            .readFileSync(path.resolve(__dirname, `./messages/game/${fs
                .readdirSync(path.resolve(__dirname, './messages/game/'))[0]}`))
        ))
        .concat(Object.keys(
            JSON.parse(fs
                .readFileSync(path.resolve(__dirname, `./messages/realms/${fs
                    .readdirSync(path.resolve(__dirname, './messages/realms/'))[0]}`))
            )))
        .map(a => `'${a}'`)
        .join('|')
}