const fs = require('fs');
const path = require('path');

console.log('Transforming customCss after...')
let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
fs.writeFileSync(path.resolve(__dirname, '../../docs/assets/custom.css'), customCss);

console.log('Generating menu...')
let menu = fs.readFileSync(path.resolve(__dirname, '../../docs/index.html')).toString()
menu = menu.substring(menu.indexOf('<div class="tree-content">'));
menu = menu.substring(0, menu.indexOf('</div>') + 6);

let newTopMenu = menu;
let newClassMenu = menu;

getAllIndexes(menu, `<li><a class="category__link js-category-link category__link--ts" href="`).forEach(index => {
    let value = menu.substring(index + `<li><a class="category__link js-category-link category__link--ts" href="`.length);
    value = value.substring(0, value.indexOf(`</a>`) + 4);

    let name = value.split('"')[0];
    let isClass = name.includes('/')
    name = (isClass ? name.split('/')[1].split('.html')[0] : name.split('#')[1])

    let topPageUrl = `${isClass ? `classes/${name}.html` : `modules.html#${name}`}`
    newTopMenu = newTopMenu.replace(value, `${topPageUrl}" data-id="/${topPageUrl}">${name}</a>`);

    let classPageUrl = `${isClass ? `classes/${name}.html` : `modules.html#${name}`}`
    newClassMenu = newClassMenu.replace(value, `${classPageUrl}" data-id="/${classPageUrl}">${name}</a>`);
});

newClassMenu = newClassMenu.replace(/classes\//g, '../classes/');
newClassMenu = newClassMenu.replace(/modules\.html/g, '../modules.html');

console.log('Writing menu...');
['index.html', 'modules.html', ...fs.readdirSync(path.resolve(__dirname, '../../docs/classes')).map(file => `classes/${file}`)]
    .forEach(file => {
        console.log(`   ${file}`)

        let content = fs.readFileSync(path.resolve(__dirname, `../../docs/${file}`)).toString();

        let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
        thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

        if (file.startsWith('classes/'))
            content = content.replace(thisMenu, newClassMenu);
        else
            content = content.replace(thisMenu, newTopMenu);

        fs.writeFileSync(path.resolve(__dirname, `../../docs/${file}`), content);
    });

console.log('Transforming readme after...')
let index = fs.readFileSync(path.resolve(__dirname, '../../docs/index.html')).toString();

let examplesStart = index.indexOf('<p>;')
let examplesEnd = index.indexOf('</div>', examplesStart)

console.log('Parsing examples...')
let examples = index;

examples = examples.substring(examples.indexOf('<p>;') + 4)
examples = examples.substring(0, examples.indexOf('</div>'))

examples = examples.split('<p>:')

examples = examples.map(a => a.replace(/<p>/g, ''));
examples = examples.map(a => a.replace(/<\/p>/g, ''));

let parsedExamples = {};
examples.forEach(example => {

    let key = example.split('\n')[0];
    let value = example.split('\n').slice(1).join('\n');

    let k0 = key.split('|')[0];
    if (!parsedExamples[k0]) parsedExamples[k0] = Object.create(null); //Object.create(null) to allow 'constructor' as valid key
    let k1 = key.split('|')[1];
    if (!parsedExamples[k0][k1]) parsedExamples[k0][k1] = Object.create(null); //Object.create(null) to allow 'constructor' as valid key
    let k2 = key.split('|')[2];
    if (!parsedExamples[k0][k1][k2]) parsedExamples[k0][k1][k2] = [];
    let k3 = key.split('|')[3];
    parsedExamples[k0][k1][k2][k3] = value;
})

console.log('Removing examples from readme...')
index = index.replace(index.substring(examplesStart, examplesEnd), '')
fs.writeFileSync(path.resolve(__dirname, '../../docs/index.html'), index);

console.log('Injecting examples...')
for (const [className, classData] of Object.entries(parsedExamples)) {
    console.log(`   ${className}`)

    let file = fs.readFileSync(path.resolve(__dirname, `../../docs/classes/${className}.html`)).toString();

    for (const [type, typeData] of Object.entries(classData))
        for (const [name, examples] of Object.entries(typeData)) {
            if (examples.length == 0) continue;

            let index = -1;

            let flags = [
                '<span class="tsd-flag ts-flagPrivate">Private</span> ',
                '<span class="tsd-flag ts-flagReadonly">Readonly</span> '
            ]

            for (flags of combinations(flags)) {
                index = file.indexOf(`<h3 class="tsd-anchor-link">${flags.join('')}${name.split(/(?=[A-Z])/).join('<wbr/>')}`)
                if (index !== -1)
                    break;
            }

            if (index === -1)
                throw new Error(`Couldn't find ${type} ${className}.${name}`)

            let sectioned = file.substring(index);

            if (type == 'methods') {
                index += sectioned.indexOf('<ul class="tsd-descriptions">')
                sectioned = file.substring(index)

                let ii = 0;

                let ulCount = 1

                while (true) {
                    if (ulCount == 0) break;

                    let start = sectioned.indexOf('<ul', ii + 3)
                    let end = sectioned.indexOf('</ul>', ii) + 3

                    if ((end === -1 && start !== -1) || start < end) {
                        ii = start
                        ulCount++
                    } else if ((start === -1 && end !== -1) || end < start) {
                        ii = end
                        ulCount--
                    } else if (start === -1 && end === -1)
                        throw new Error(`No matching </ul> for <ul> at ${index} in docs/classes/${className}.html`)
                }

                index += ii + 2
            } else if (type == 'constructors') {
                index += sectioned.indexOf('<ul class="tsd-descriptions">')
                sectioned = file.substring(index)

                index += sectioned.indexOf('</section>')
            } else if (type == 'properties') {
                index += sectioned.indexOf('<div class="tsd-signature tsd-kind-icon">')
                sectioned = file.substring(index)

                index += sectioned.indexOf('</div>') + 6;
            }

            let injection =
                `                
                <ul class="tsd-signatures tsd-descriptions" style="border-bottom: none${type == 'properties' ? '; border-top: none' : ''}">
                    <li class="tsd-description" style="padding-left: 20px; padding-top: 1em; padding-bottom: 1em; padding-right: 20px;">                        
                        <h4>Example${examples.length > 1 ? 's' : ''}</h4>
                        ${examples.join('<br>\n')}                        
                    </li>
                </ul>
                `

            file = file.substring(0, index) + injection + file.substring(index);
        }

    fs.writeFileSync(path.resolve(__dirname, `../../docs/classes/${className}.html`), file);
}

// console.log('Writing overwrites...')
// console.log('   style.css')
// fs.writeFileSync(path.resolve(__dirname, `../../docs/assets/style.css`), fs.readFileSync(path.resolve(__dirname, `./overwrites/style.css`)).toString());

console.log('Done')

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

function combinations(arr) {
    let out = [];

    for (let i = 0; i < Math.pow(2, arr.length); i++) {
        let our = [];
        let binary = dec2bin(i);
        if (binary.length == 1) binary = `0${binary}`

        arr.filter((_, i) => binary[i] == '1').forEach(v => our.push(v));

        out.push(our)
    }

    return out;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}