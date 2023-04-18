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
    out += exportClass.replace('class ', 'export class ');

for (const utilClass of utilClasses)
    out += utilClass.replace('class ', 'declare class ');

for (const [name, value] of Object.entries(types))
    out += `type ${name}=${value};`


let typesOut = '';

for (const [name, value] of Object.entries(dataTypes))
    typesOut += `export type ${name}=${value};`

console.log('Replacing version...')
out = out.replaceAll('{version}', version);
typesOut = typesOut.replaceAll('{version}', version);

(async () => {
    console.log('Minifying output...');

    console.log('out...')
    out = minifyTypeFile(out);

    console.log('typesOut...')
    typesOut = minifyTypeFile(typesOut);

    console.log('Saving output...')
    await Promise.all([
        fs.promises.writeFile(path.resolve(__dirname, '../index.d.ts'), out),
        fs.promises.writeFile(path.resolve(__dirname, '../src/types.d.ts'), typesOut)
    ]);

    console.log('Done generating types')
})();

function minifyTypeFile(typeFile) {
    typeFile = typeFile.replaceAll('\r\n', '\n');

    typeFile = removeComments(typeFile);

    const specialCharacters = '<>=?:,|&;{}()\\\\\'"\\[\\]\\n/';
    const normalCharacters = 'a-zA-Z0-9_';
    const whitespaceCharacters = ' \\t\\n';
    const preventJSDoc = '(?<=^[^*]*)';

    const regexString = `${preventJSDoc}(((?<=[${specialCharacters}])[${whitespaceCharacters}]+(?=[${normalCharacters}]))|((?<=[${normalCharacters}])[${whitespaceCharacters}]+(?=[${specialCharacters}]))|((?<=[${specialCharacters}])[${whitespaceCharacters}]+(?=[${specialCharacters}])))`;
    const regex = new RegExp(regexString, 'gm');

    //todo: make replacing async
    typeFile = typeFile.replace(regex, ''); //remove all whitespace
    typeFile = typeFile.replace(/^[ \t]+(?= \*( |\/))/gm, ''); //remove all whitespace before jsdoc
    typeFile = typeFile.replace(/[ \t]+(?=\n)/g, ''); //remove whitespace at end of lines
    typeFile = typeFile.replaceAll('/**', '\n/**'); //add newlines before jsdoc

    return typeFile;
}

function removeComments(text) {
    text = text.replaceAll('\r\n', '\n')

    text = text.replace(/\/\*[^\*](.|\n)*?\*\//g, ''); // matches multiline comments except for docstring
    text = text.replace(/(?<!http(s?):)\/\/.+?\n/g, ''); // matches single line comments except for urls

    return text;
}

function extractClass(text) {
    text = removeComments(text)

    let startIndex = text.indexOf('export class ');
    if (
        text.lastIndexOf('*/', startIndex) !== -1 &&
        startIndex - text.lastIndexOf('*/', startIndex) < 10
    )
        startIndex = text.lastIndexOf('/**', startIndex);

    text = text.substring(startIndex);
    text.replace('export class ', 'class ')

    let letterIndex = text.indexOf('class ');
    text = text.split('')
    let braceCount = 0;
    let started = false;
    let end;

    for (; letterIndex < text.length; letterIndex++) {
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