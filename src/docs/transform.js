const fs = require('fs');
const path = require('path');

let readme = fs.readFileSync(path.resolve(__dirname, './Readme.md')).toString()
readme = readme.replace(/\r\n/g, '\n').split('\n').filter(a => !a.includes('#gh-light-mode-only')).join('\n');

let licensePosition = readme.split('\n').findIndex(a => a.includes('ISC%20license_dark.png'));
readme = readme.split('\n')
readme[licensePosition] = `![ISC license](/assets/ISC%20license_docs.png)`
readme = readme.join('\n')

readme = readme.replace(/\/assets\//g, '/minecraft-server/assets/');
fs.writeFileSync(path.resolve(__dirname, './Readme.md'), readme);

let types = fs.readFileSync(path.resolve(__dirname, './index.d.ts')).toString()
types = types.replace(/extends EventEmitter /g, '');
fs.writeFileSync(path.resolve(__dirname, './index.d.ts'), types);