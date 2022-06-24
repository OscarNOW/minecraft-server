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
    })

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