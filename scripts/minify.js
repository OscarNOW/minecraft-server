const fs = require('fs');
const path = require('path');

console.log('Minifying JSON files...')

for (const file of [
    './settings.json',
    ...fs
        .readdirSync(path.resolve(__dirname, '../src/', './data/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/${a}`),
    ...fs
        .readdirSync(path.resolve(__dirname, '../src/', './data/messages/game/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/messages/game/${a}`),
    ...fs
        .readdirSync(path.resolve(__dirname, '../src/', './data/messages/realms/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/messages/realms/${a}`)
]) {
    console.log(`   ${file}`);
    fs.writeFileSync(path.resolve(__dirname, '../src/', file), JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/', file)))))
}

console.log('Done minifying')