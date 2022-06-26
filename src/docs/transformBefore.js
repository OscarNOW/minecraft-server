const fs = require('fs');
const path = require('path');

console.log('Transforming readme before...')

let readme = fs.readFileSync(path.resolve(__dirname, './Readme.md')).toString()

readme = readme.replace(/\r\n/g, '\n').split('\n').filter(a => !a.includes('#gh-light-mode-only')).join('\n');
let licensePosition = readme.split('\n').findIndex(a => a.includes('ISC%20license_dark.png'));
readme = readme.split('\n')
readme[licensePosition] = `![ISC license](/assets/ISC%20license_docs.png)`
readme = readme.join('\n')

readme = readme.replace(/\/assets\//g, '/minecraft-server/assets/');

console.log('Getting examples...')
let examples = {};

examples = {
    ...examples, ...Object.fromEntries(fs
        .readdirSync(path.resolve(__dirname, '../classes/exports/'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => [a.split('.examples.js')[0],
        Object.fromEntries(
            Object.entries(
                require(`../classes/exports/${a}`)
            )
                .map(([key, value]) => key == 'constructor' ? ['constructors', { constructor: value }] : [key, value])
        )])
    )
}

examples = {
    ...examples, ...Object.fromEntries(fs
        .readdirSync(path.resolve(__dirname, '../classes/utils/'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => [a.split('.examples.js')[0],
        Object.fromEntries(
            Object.entries(
                require(`../classes/utils/${a}`)
            )
                .map(([key, value]) => key == 'constructor' ? ['constructors', { constructor: value }] : [key, value])
        )])
    )
}

readme += `



;`

console.log('Parsing examples...')
let parsedExamples = [];

for (const [k1, v1] of Object.entries(examples)) {
    let t1 = `${k1}`;

    ['methods', 'properties', 'constructors'].forEach(k2 => {
        let v2 = v1[k2];
        let t2 = `${t1}|${k2}`

        if (v2)
            for (const [k3, v3] of Object.entries(v2)) {
                let t3 = `${t2}|${k3}`;

                v3.forEach((v4, k4) => {
                    let t4 = `${t3}|${k4}`;

                    parsedExamples.push(`${t4}\n` + "```" + `js\n${v4.code}\n` + "```")
                })
            }
    })
}

readme += parsedExamples.join('\n:')

fs.writeFileSync(path.resolve(__dirname, './Readme.md'), readme);

console.log('Transforming types...')
let types = fs.readFileSync(path.resolve(__dirname, './index.d.ts')).toString()
types = types.replace(/extends EventEmitter /g, '');
fs.writeFileSync(path.resolve(__dirname, './index.d.ts'), types);