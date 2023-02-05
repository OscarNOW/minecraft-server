const p = '../../src/data/entities.json';

const d = require(p);
const fs = require('fs');
const path = require('path');

let a = Object.entries(d).map(([k, v], i) => ({
    name: k,
    living: v.living
}));
// console.log(a);

fs.writeFileSync(path.resolve(__dirname, p), JSON.stringify(a))