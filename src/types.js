const fs = require('fs')
const path = require('path')

console.log('Getting export classes...')

let exportClasses =
    fs
        .readdirSync(path.resolve(__dirname, './classes/exports/'))
        .filter(a => a.endsWith('.d.ts'))
        .map(a => fs.readFileSync(path.resolve(__dirname, `./classes/exports/${a}`)).toString())
        .map(a => extractClass(a))

console.log(fs
    .readdirSync(path.resolve(__dirname, './classes/exports/'))
    .filter(a => a.endsWith('.d.ts'))
    .map(a => `    ${a}`)
    .join('\n')
)

console.log('Getting util classes...')

let utilClasses =
    fs
        .readdirSync(path.resolve(__dirname, './classes/utils/'))
        .filter(a => a.endsWith('.d.ts'))
        .map(a => fs.readFileSync(path.resolve(__dirname, `./classes/utils/${a}`)).toString())
        .map(a => extractClass(a))

console.log(fs
    .readdirSync(path.resolve(__dirname, './classes/utils/'))
    .filter(a => a.endsWith('.d.ts'))
    .map(a => `    ${a}`)
    .join('\n')
)

console.log('Getting types...')

let types = {};

types = {
    ...types, ...Object.fromEntries(
        fs
            .readdirSync(path.resolve(__dirname, './classes/exports/'))
            .filter(a => a.endsWith('.d.ts'))
            .map(a => fs.readFileSync(path.resolve(__dirname, `./classes/exports/${a}`)).toString())
            .map(extractTypes)
            .flat()
            .map(a => ([a.substring(5).split(' ')[0], a]))
            .map(([key, value]) => [key, value.substring(key.length + 8)])
            .map(([key, value]) => [key, value.substring(0, value.length - 1)])
            .filter(([key, value]) => key != '')
    )
}

types = {
    ...types, ...Object.fromEntries(
        fs
            .readdirSync(path.resolve(__dirname, './classes/utils/'))
            .filter(a => a.endsWith('.d.ts'))
            .map(a => fs.readFileSync(path.resolve(__dirname, `./classes/utils/${a}`)).toString())
            .map(extractTypes)
            .flat()
            .map(a => ([a.substring(5).split(' ')[0], a]))
            .map(([key, value]) => [key, value.substring(key.length + 8)])
            .map(([key, value]) => [key, value.substring(0, value.length - 1)])
            .filter(([key, value]) => key != '')
    )
}

types = {
    ...types, ...Object.assign({}, ...fs
        .readdirSync(path.resolve(__dirname, './data/'))
        .filter(a => a.endsWith('.types.js'))
        .map(a => require(`./data/${a}`))
    )
}

console.log(Object.keys(types).map(a => `    ${a}`).join('\n'))
console.log('Sorting types...')

types = Object.fromEntries(Object.entries(types)
    .sort((a, b) => a[1].length - b[1].length)
)

console.log('Generating output...')

let out = `import { EventEmitter } from 'events';`

for (const exportClass of exportClasses)
    out += `export ${exportClass}`;

for (const utilClass of utilClasses)
    out += `declare ${utilClass}`;

for (const [name, value] of Object.entries(types))
    out += `type ${name} = ${value};`

fs.writeFileSync(path.resolve(__dirname, '../index.d.ts'), out)

console.clear()
console.log('Successfully generated types')

function extractClass(text) {
    text = text.substring(text.indexOf('export class ') + 7).split('')

    let braceCount = 0;
    let started = false;
    let end;

    for (const letterIndex in text) {
        const letter = text[letterIndex]

        if (letter == '{') braceCount++;
        if (letter == '}') braceCount--;

        if (braceCount != 0) started = true;
        if (braceCount == 0 && started) {
            end = parseInt(letterIndex) + 1;
            break;
        }
    }

    return text.join('').substring(0, end)
}

function extractTypes(text) {
    return getAllIndexes(text, 'type ')
        .map(start => text.substring(start))
        .map(text => removeEndFromType(text))
        .filter(a => !a.includes('import'))
}

function removeEndFromType(text) {
    let textUntilColon = text.substring(0, text.indexOf(';') + 1);

    if (!textUntilColon.includes('{')) return textUntilColon;

    let braceCount = 0;
    let out = '';

    for (const letterIndex in text) {
        const letter = text.split('')[letterIndex];

        if (letter == '{') braceCount++;
        if (letter == '}') braceCount--;

        out += letter;

        if (braceCount == 0 && letter == ';')
            break;

    }

    if (!out.endsWith(';'))
        throw new Error(`Type definition doesn't end with semicolon.\n    at type ${out.split(' ')[1]} = \n`)

    return out;
}

function getAllIndexes(str, val) {
    let indexes = [];
    let i = 0;

    while (i != -1) {
        i = str.indexOf(val, i + 1)

        if (i != -1)
            indexes.push(i);
    }

    return indexes;
}