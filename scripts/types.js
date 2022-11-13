const fs = require('fs')
const path = require('path')

const { getAllIndexes } = require('../src/functions/getAllIndexes.js');

console.clear();
console.log('Getting export classes...')

let exportClasses =
    fs
        .readdirSync(path.resolve(__dirname, '../src/classes/exports/'))
        .filter(a => a.endsWith('.d.ts'))
        .map(a => fs.readFileSync(path.resolve(__dirname, `../src/classes/exports/${a}`)).toString())
        .map(a => extractClass(a))

console.log(fs
    .readdirSync(path.resolve(__dirname, '../src/classes/exports/'))
    .filter(a => a.endsWith('.d.ts'))
    .map(a => `    ${a}`)
    .join('\n')
)

console.log('Getting util classes...')

let utilClasses =
    fs
        .readdirSync(path.resolve(__dirname, '../src/classes/utils/'))
        .filter(a => a.endsWith('.d.ts'))
        .map(a => fs.readFileSync(path.resolve(__dirname, `../src/classes/utils/${a}`)).toString())
        .map(a => extractClass(a))

console.log(fs
    .readdirSync(path.resolve(__dirname, '../src/classes/utils/'))
    .filter(a => a.endsWith('.d.ts'))
    .map(a => `    ${a}`)
    .join('\n')
)

console.log('Getting types...')

let types = {};

types = {
    ...types, ...Object.fromEntries(
        fs
            .readdirSync(path.resolve(__dirname, '../src/classes/exports/'))
            .filter(a => a.endsWith('.d.ts'))
            .map(a => fs.readFileSync(path.resolve(__dirname, `../src/classes/exports/${a}`)).toString())
            .map(extractTypes)
            .flat()
            .map(a => ([a.substring(5).split(' ')[0], a]))
            .map(([key, value]) => [key, value.substring(key.length + 8)])
            .map(([key, value]) => [key, value.substring(0, value.length - 1)])
            .filter(([key]) => key !== '')
    )
}

types = {
    ...types, ...Object.fromEntries(
        fs
            .readdirSync(path.resolve(__dirname, '../src/classes/utils/'))
            .filter(a => a.endsWith('.d.ts'))
            .map(a => fs.readFileSync(path.resolve(__dirname, `../src/classes/utils/${a}`)).toString())
            .map(extractTypes)
            .flat()
            .map(a => ([a.substring(5).split(' ')[0], a]))
            .map(([key, value]) => [key, value.substring(key.length + 8)])
            .map(([key, value]) => [key, value.substring(0, value.length - 1)])
            .filter(([key]) => key !== '')
    )
}

types = {
    ...types, ...Object.assign({}, ...fs
        .readdirSync(path.resolve(__dirname, '../src/data/'))
        .filter(a => a.endsWith('.types.js'))
        .map(a => require(`../src/data/${a}`))
    )
}

console.log(Object.keys(types).map(a => `    ${a}`).join('\n'))
console.log('Sorting types...')

types = Object.fromEntries(Object.entries(types)
    .sort((a, b) => a[1].length - b[1].length)
)

console.log('Generating output...')

let out = ``

for (const exportClass of exportClasses)
    out += `export ${exportClass}`;

for (const utilClass of utilClasses)
    out += `declare ${utilClass}`;

for (const [name, value] of Object.entries(types))
    out += `type ${name}=${value};`

console.log('Minifying output...')

out = out.replace(/\r\n/g, '\n')

out = out.replace(/\/\//g, '\n//')
out = out.replace(/\/\*/g, '\n/*')
out = out.replace(/\*\//g, '*/\n')

out = removeComments(out)

out = out.split('\n')
out = out.filter(a => a.trim().length > 0)
out = out.map(a => a.trim())
out = out.join('\n')

out = out.replace(/ => /g, '=>')
out = out.replace(/: /g, ':')

out = out.replace(/;\n/g, ';')
out = out.replace(/\n;/g, ';')
out = out.replace(/,\n/g, ',')
out = out.replace(/{\n/g, '{')
out = out.replace(/\n}/g, '}')
out = out.replace(/\(\n/g, '(')
out = out.replace(/\n\)/g, ')')
out = out.replace(/, /g, ',')
out = out.replace(/ \| /g, '|')
out = out.replace(/readonly \[/g, 'readonly[')
out = out.replace(/}\n/g, '};')
out = out.replace(/;}/, '}')
out = out.replace(/(?<=class [a-zA-Z]+(?: extends [a-zA-Z]+)?) (?={)/g, '')

out = out.replace(/:\n/g, ':')

fs.writeFileSync(path.resolve(__dirname, '../index.d.ts'), out)

console.clear();
console.log('Done generating types')

function removeComments(text) {
    text = text.replace(/\*(.|[\r\n])*?\*/g, '');
    text = text.split('\n').filter(a => !a.startsWith('//')).join('\n')

    return text;
}

function extractClass(text) {
    text = removeComments(text)
    text = text.substring(text.indexOf('export class ') + 7).split('')

    let braceCount = 0;
    let started = false;
    let end;

    for (const letterIndex in text) {
        const letter = text[letterIndex]

        if (letter === '{') braceCount++;
        if (letter === '}') braceCount--;

        if (braceCount !== 0) started = true;
        if (braceCount === 0 && started) {
            end = parseInt(letterIndex) + 1;
            break;
        }
    }

    return text.join('').substring(0, end)
}

function extractTypes(text) {
    text = removeComments(text)
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

        if (letter === '{') braceCount++;
        if (letter === '}') braceCount--;

        out += letter;

        if (braceCount === 0 && letter === ';')
            break;

    }

    if (!out.endsWith(';'))
        throw new Error(`Type definition doesn't end with semicolon.\n    at type ${out.split(' ')[1]} = \n`)

    return out;
}