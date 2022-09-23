const fs = require('fs');
const path = require('path');

const { convertToType } = require('../functions/convertToType.js');

module.exports = {
    chatTranslate: convertToType(
        Object.keys(
            JSON.parse(fs
                .readFileSync(path.resolve(__dirname, `./messages/game/${fs
                    .readdirSync(path.resolve(__dirname, './messages/game/'))[0]}`))
            ))
            .concat(Object.keys(
                JSON.parse(fs
                    .readFileSync(path.resolve(__dirname, `./messages/realms/${fs
                        .readdirSync(path.resolve(__dirname, './messages/realms/'))[0]}`))
                )
            ))
    )
}