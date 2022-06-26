const fs = require('fs');
const path = require('path');

let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
fs.writeFileSync(path.resolve(__dirname, '../../docs/assets/custom.css'), customCss);

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

['index.html', 'modules.html', ...fs.readdirSync(path.resolve(__dirname, '../../docs/classes')).map(file => `classes/${file}`)]
    .forEach(file => {
        let content = fs.readFileSync(path.resolve(__dirname, `../../docs/${file}`)).toString();

        let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
        thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

        if (file.startsWith('classes/'))
            content = content.replace(thisMenu, newClassMenu);
        else
            content = content.replace(thisMenu, newTopMenu);

        fs.writeFileSync(path.resolve(__dirname, `../../docs/${file}`), content);
    });

let index = fs.readFileSync(path.resolve(__dirname, '../../docs/index.html')).toString();

let examplesStart = index.indexOf('<p>;')
let examplesEnd = index.indexOf('</div>', examplesStart)

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
    if (!parsedExamples[k0]) parsedExamples[k0] = {};
    let k1 = key.split('|')[1];
    if (!parsedExamples[k0][k1]) parsedExamples[k0][k1] = {};
    let k2 = key.split('|')[2];
    if (!parsedExamples[k0][k1][k2]) parsedExamples[k0][k1][k2] = [];
    let k3 = key.split('|')[3];
    parsedExamples[k0][k1][k2][k3] = value;
})

index = index.replace(index.substring(examplesStart, examplesEnd), '')
fs.writeFileSync(path.resolve(__dirname, '../../docs/index.html'), index);

for (const [className, classData] of Object.entries(parsedExamples)) {
    let file = fs.readFileSync(path.resolve(__dirname, `../../docs/classes/${className}.html`)).toString();

    for (const [type, typeData] of Object.entries(classData))
        for (const [name, examples] of Object.entries(typeData)) {
            let index = -1;

            let flags = [
                '<span class="tsd-flag ts-flagPrivate">Private</span> ',
                '<span class="tsd-flag ts-flagReadonly">Readonly</span> '
            ]

            for (flags of combinations(flags)) {
                index = file.indexOf(`<h3 class="tsd-anchor-link">${flags.join('')}${name}`)
                if (index !== -1)
                    break;
            }

            if (index === -1)
                throw new Error(`Couldn't find ${type} ${className}.${name}`)

            let sectioned = file.substring(index);

            index += sectioned.indexOf('<ul class="tsd-descriptions">') + 3
            sectioned = file.substring(index)

            let ulCount = 1

            for (i in sectioned.split('')) {
                let ind = parseInt(i);

                let str =
                    sectioned.split('')[ind + 0] +
                    sectioned.split('')[ind + 1] +
                    sectioned.split('')[ind + 2] +
                    sectioned.split('')[ind + 3] +
                    sectioned.split('')[ind + 4];

                if (str.startsWith('<ul')) ulCount++;
                if (str.startsWith('</ul>')) ulCount--;

                if (ulCount == 0) {
                    index += ind + 5;
                    break;
                }
            }

            let injection =
                `                
                <ul class="tsd-signatures tsd-descriptions" style="border-bottom: none">
                    <li class="tsd-description" style="padding-left: 20px; padding-top: 1em; padding-bottom: 1em; padding-right: 20px;">                        
                        <h4>Examples</h4>
                        ${examples.join('<br>\n')}                        
                    </li>
                </ul>
                `

            file = file.substring(0, index) + injection + file.substring(index);
        }

    fs.writeFileSync(path.resolve(__dirname, `../../docs/classes/${className}.html`), file);
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