const fs = require('fs')
const path = require('path')

const { getAllIndexes } = require('../src/functions/getAllIndexes.js');
const version = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString()).version;

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
            .map(typeToNameValue)
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
            .map(typeToNameValue)
            .filter(([key]) => key !== '')
    )
}

let dataTypes = Object.assign({}, ...fs
    .readdirSync(path.resolve(__dirname, '../src/data/'))
    .filter(a => a.endsWith('.types.js'))
    .map(a => require(`../src/data/${a}`))
);

types = {
    ...types, ...dataTypes
}

console.log(Object.keys(types).map(a => `    ${a}`).join('\n'))
console.log('Sorting types...')

dataTypes = Object.fromEntries(Object.entries(dataTypes)
    .sort((a, b) => a[1].length - b[1].length)
)

types = Object.fromEntries(Object.entries(types)
    .sort((a, b) => a[1].length - b[1].length)
)

console.log('Generating output...')
let out = '';

for (const exportClass of exportClasses)
    out += `export ${exportClass}`;

for (const utilClass of utilClasses)
    out += `declare ${utilClass}`;

for (const [name, value] of Object.entries(types))
    out += `type ${name}=${value};`


let typesOut = '';

for (const [name, value] of Object.entries(dataTypes))
    typesOut += `export type ${name}=${value};`

console.log('Replacing version...')
out = out.replaceAll('{version}', version);
typesOut = typesOut.replaceAll('{version}', version);

console.log('Minifying output...')
out = minifyTypeFile(out);
typesOut = minifyTypeFile(typesOut);

console.log('Saving output...')
fs.writeFileSync(path.resolve(__dirname, '../index.d.ts'), out);
fs.writeFileSync(path.resolve(__dirname, '../src/types.d.ts'), typesOut);

console.log('Done generating types')

function minifyTypeFile(typeFile) {
    typeFile = typeFile.replaceAll('\r\n', '\n');

    typeFile = removeComments(typeFile);

    typeFile = typeFile.split('\n');
    typeFile = typeFile.filter(a => a.trim().length > 0);
    typeFile = typeFile.map(a => a.trim());
    typeFile = typeFile.join('\n');

    typeFile = typeFile.replaceAll(' =>', '=>');
    typeFile = typeFile.replaceAll('=> ', '=>');
    typeFile = typeFile.replaceAll(' ?', '?');
    typeFile = typeFile.replaceAll('? ', '?');
    typeFile = typeFile.replaceAll(' :', ':');
    typeFile = typeFile.replaceAll(': ', ':');
    typeFile = typeFile.replaceAll(' ,', ',');
    // typeFile = typeFile.replaceAll(', ', ','); //disabled because of jsdoc
    typeFile = typeFile.replaceAll(' |', '|');
    typeFile = typeFile.replaceAll('| ', '|');
    typeFile = typeFile.replaceAll(' &', '&');
    typeFile = typeFile.replaceAll('& ', '&');

    typeFile = typeFile.replaceAll('|\n', '|');
    typeFile = typeFile.replaceAll('\n|', '|');
    typeFile = typeFile.replaceAll(':\n', ':');
    typeFile = typeFile.replaceAll(';\n', ';');
    typeFile = typeFile.replaceAll('\n;', ';');
    typeFile = typeFile.replaceAll(',\n', ',');
    typeFile = typeFile.replaceAll('{\n', '{');
    typeFile = typeFile.replaceAll('\n}', '}');
    typeFile = typeFile.replaceAll('(\n', '(');
    typeFile = typeFile.replaceAll('\n)', ')');

    typeFile = typeFile.replaceAll('}\n', '};');
    typeFile = typeFile.replaceAll(';}\n', '};');

    typeFile = typeFile.replaceAll('readonly [', 'readonly[');
    typeFile = typeFile.replaceAll("extends '", "extends'");

    typeFile = typeFile.replaceAll('/**', '\n/**');

    typeFile = typeFile.replace(/(?<=class [a-zA-Z]+(?: extends [a-zA-Z]+)?) (?={)/g, '');

    return typeFile;
}

function removeComments(text) {
    if (text.includes('/**'))
        debugger; //todo-imp: remove
    text = text.replaceAll('\r\n', '\n')
    text = text.replaceAll('//', '\n//')

    text = text.replace(/\/\*[^\*](.|\n)*?\*\//g, ''); // matches multiline comments except for docstring
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

function typeToNameValue(type) {
    type = [type.split('=')[0].split('type ').slice(1).join('type '), type.split('=').slice(1).join('=').slice(0, -1)]
    type = [type[0].trim(), type[1].trim()]

    return type;
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