const fs = require('fs');
const old = require('./entities.json');
// let n = {};
// let count = 0;

// for (const [key, value] of Object.entries(old)) {
//     n[key] = { id: value.id ?? count, living: value.living };
//     count++;
// }

// fs.writeFileSync('./new.json', JSON.stringify(n))

let n = '';

for (const [key, value] of Object.entries(old))
    if (n == '')
        n += `'${key}'`
    else
        n += ` || '${key}'`

fs.writeFileSync('./new.txt', n)