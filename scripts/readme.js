const fs = require('fs');
const path = require('path');

let readme = fs.readFileSync(path.join(__dirname, '../.github/README.md')).toString();
readme = readme.split('\n');

readme = readme.filter(a => !a.includes('#gh-dark-mode-only'));

readme = readme.join('\n');
fs.writeFileSync(path.join(__dirname, '../README.md'), readme)