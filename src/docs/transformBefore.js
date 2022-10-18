const fs = require('fs');
const path = require('path');

console.log('Transforming readme before...')

let readme = fs.readFileSync(path.resolve(__dirname, './Readme.md')).toString()

readme = readme.replace(/\r\n/g, '\n').replace(/:warning:/g, '⚠').split('\n').filter(a => !a.includes('#gh-light-mode-only')).join('\n');
let licensePosition = readme.split('\n').findIndex(a => a.includes('ISC%20license/github/dark.png'));
readme = readme.split('\n')
readme[licensePosition] = `
<div class="darkImg"><img loading="lazy" src="./assets/ISC license/docs/dark.png" alt="ISC License explanation"></div>
<div class="lightImg"><img loading="lazy" src="./assets/ISC license/docs/light.png" alt="ISC License explanation"></div>
`
readme = readme.join('\n')

fs.writeFileSync(path.resolve(__dirname, './Readme.md'), readme);

console.log('Transforming types...')
let types = fs.readFileSync(path.resolve(__dirname, './index.d.ts')).toString()
types = types.replace(/\r\n/g, '\n')
types = types.replace('readonly 0:Client;\n', '') // this will probably break something in the future
types = types.replace('readonly[entityId:number]:EntityLike;', 'readonly[entityId:number]:EntityLike|Client;')
fs.writeFileSync(path.resolve(__dirname, './index.d.ts'), types);