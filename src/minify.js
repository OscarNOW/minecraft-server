const fs = require('fs');
const path = require('path');

console.clear();
console.log('Minifieing JSON files')

for (const file of fs
    .readdirSync(path.resolve(__dirname, './data/'))
    .filter(file => file.endsWith('.json'))
) {
    console.log(`   ${file}`);
    fs.writeFileSync(path.resolve(__dirname, './data/') + '/' + file, JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/') + '/' + file))))
}

console.clear();
console.log('Done minifieing')