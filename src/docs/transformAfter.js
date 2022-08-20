const fs = require('fs');
const path = require('path');

console.log('Transforming customCss...')
let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
fs.writeFileSync(path.resolve(__dirname, '../../docs/assets/custom.css'), customCss);

console.log('Generating menu...')
let menu = fs.readFileSync(path.resolve(__dirname, '../../docs/index.html')).toString()
menu = menu.substring(menu.indexOf('<div class="tree-content">'));
menu = menu.substring(0, menu.indexOf('</div>') + 6);

let newTopMenu = menu;

for (const index of getAllIndexes(menu, `<li><a class="category__link js-category-link category__link--ts" href="`)) {
    let value = menu.substring(index + `<li><a class="category__link js-category-link category__link--ts" href="`.length);
    value = value.substring(0, value.indexOf(`</a>`) + 4);

    let name = value.split('"')[0];
    let isClass = name.includes('classes/')
    name = name.split('/')[1].split('.html')[0]

    let url = `${isClass ? 'classes' : 'types'}/${name}.html`
    newTopMenu = newTopMenu.replace(value, `${url}" data-id="/${url}">${name}</a>`);
};

let newInnerMenu = newTopMenu;

newInnerMenu = newInnerMenu.replace(/classes\//g, '../classes/');
newInnerMenu = newInnerMenu.replace(/types\//g, '../types/');

console.log('Writing menu...');
for (const file of [
    'index.html',
    'modules.html',
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/classes')).map(file => `classes/${file}`),
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/types')).map(file => `types/${file}`)
]) {
    console.log(`   ${file}`)

    let content = fs.readFileSync(path.resolve(__dirname, `../../docs/${file}`)).toString();

    let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
    thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

    if (file.includes('/'))
        content = content.replace(thisMenu, newInnerMenu);
    else
        content = content.replace(thisMenu, newTopMenu);

    fs.writeFileSync(path.resolve(__dirname, `../../docs/${file}`), content);
};

console.log('Writing overwrites...')
console.log('   style.css')
fs.writeFileSync(path.resolve(__dirname, `../../docs/assets/style.css`), fs.readFileSync(path.resolve(__dirname, `./overwrites/style.css`)).toString());

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