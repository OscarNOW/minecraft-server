const d = require('../../src/data/blocks.json');
const fs = require('fs');
const path = require('path');

fs.writeFileSync(path.resolve(__dirname, '../../src/data/blocks.json'), JSON.stringify(d))