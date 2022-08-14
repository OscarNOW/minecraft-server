const fs = require('fs');
const path = require('path');

console.clear();
console.log('Minifieing JSON files')

for (const file of [
    ...fs
        .readdirSync(path.resolve(__dirname, './data/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/${a}`),
    ...fs
        .readdirSync(path.resolve(__dirname, './data/messages/game/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/messages/game/${a}`),
    ...fs
        .readdirSync(path.resolve(__dirname, './data/messages/realms/'))
        .filter(file => file.endsWith('.json'))
        .map(a => `./data/messages/realms/${a}`),
]) {
    console.log(`   ${file}`);
    fs.writeFileSync(path.resolve(__dirname, file), JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(__dirname, file)))))
}

console.clear();
console.log('Done minifieing')