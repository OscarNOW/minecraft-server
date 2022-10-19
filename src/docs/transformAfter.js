const fs = require('fs');
const path = require('path');

console.log('Transforming customCss...')
let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/github/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
customCss += `
#versionDropdownLabel {
    margin-left: 5px;
    margin-right: 5px;
}
`
fs.writeFileSync(path.resolve(__dirname, '../../docs/github/assets/custom.css'), customCss);

console.log('Generating index...')
const versionManifest = require('../../docs/manifest.json')
const latestStableVersion = versionManifest.versions.find(({ latestStable }) => latestStable);
const latestStableVersionPath = latestStableVersion.path ?? latestStableVersion.name;
const latestStableVersionName = latestStableVersion.name;
const redirectionPage = `
<!DOCTYPE html>
<script>location = "{pathBefore}${latestStableVersionPath}/{path}"</script>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}${latestStableVersionName} docs minecraft-server</title>
</head>
<body>
    Redirecting to latest stable version...
</body>
</html>
`;

console.log('Generating version dropdown...')
let versionDropdown = `<label for="versionDropdown" id="versionDropdownLabel">@</label><select id="versionDropdown" class="title" onchange="versionChange(this.value)"></select>`;

console.log('Generating version dropdown script...')
let docScript = `
<script defer>
${fs.readFileSync(path.resolve(__dirname, './docScript.js')).toString()}
</script>
`;

console.log('Generating menu...')
let menu = fs.readFileSync(path.resolve(__dirname, '../../docs/github/index.html')).toString()
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

console.log('Writing files...');
for (const file of [
    'index.html',
    'modules.html',
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/github/classes')).map(file => `classes/${file}`),
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/github/types')).map(file => `types/${file}`)
]) {
    console.log(`   ${file}`)

    let content = fs.readFileSync(path.resolve(__dirname, `../../docs/github/${file}`)).toString();

    let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
    thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

    if (file.includes('/'))
        content = content.replace(thisMenu, newInnerMenu);
    else
        content = content.replace(thisMenu, newTopMenu);

    const headLinks = [
        '<a href="" class="title">minecraft-server</a>',
        '<a href="index.html" class="title">minecraft-server</a>',
        '<a href="../index.html" class="title">minecraft-server</a>'
    ];
    let replaced = false;

    for (const headLink of headLinks) {
        if (!content.includes(headLink)) continue;

        let versionDropdownIndex = content.indexOf(headLink) + headLink.length - 1;
        content = content.split('');
        content[versionDropdownIndex] += versionDropdown;
        content = content.join('');

        replaced = true;
        break;
    }

    if (!replaced)
        throw new Error(`Couldn't find home link in ${file}`)

    content += docScript;

    let index = content.indexOf('href="');
    while (index !== -1) {
        const oldLink = content.substring(index + 'href="'.length).split('"')[0];
        let newLink = oldLink;

        if (newLink.endsWith('.html'))
            newLink = newLink.substring(0, newLink.length - '.html'.length);

        if (newLink.includes('#') && newLink.split('#')[newLink.split('#').length - 2].endsWith('.html'))
            newLink = newLink.split('#')[newLink.split('#').length - 2].substring(0, newLink.split('#')[newLink.split('#').length - 2].length - '.html'.length) + '#' + newLink.split('#').pop();

        if (newLink.endsWith('/index'))
            newLink = newLink.substring(0, newLink.length - '/index'.length);

        if (newLink.endsWith('index'))
            newLink = newLink.substring(0, newLink.length - 'index'.length) + './';

        content = content.substring(0, index + 'href="'.length) + newLink + content.substring(index + 'href="'.length + oldLink.length);

        index = content.indexOf('href="', index + 1);
    }

    let name;
    if (!file.includes('/'))
        name = ''
    else
        name = file.split('/')[1].split('.html')[0] + ' ';

    content = content.split('<title>');
    content[1] = content[1].split('</title>')[1];
    content.splice(1, 0, `<title>${name}x.x.x minecraft-server</title>`);
    content = content.join('');

    fs.writeFileSync(path.resolve(__dirname, `../../docs/github/${file}`), content);

    let filePath;
    if (!file.includes('/'))
        filePath = ''
    else
        filePath = file.split('.html')[0];

    let folder = file.split('/').slice(0, -1).join('/');

    if (folder !== '')
        fs.mkdirSync(path.join(__dirname, '../../docs/', folder), { recursive: true });

    let pathBefore;
    if (file.split('/').length == 1)
        pathBefore = './';
    else
        pathBefore = '../'.repeat(file.split('/').length - 1);

    fs.writeFileSync(path.join(__dirname, `../../docs/${file}`), redirectionPage.replaceAll('{path}', filePath).replaceAll('{title}', name).replaceAll('{pathBefore}', pathBefore));

};

console.log('Writing overwrites...')
console.log('   style.css')
fs.writeFileSync(path.resolve(__dirname, `../../docs/github/assets/style.css`), fs.readFileSync(path.resolve(__dirname, `./overwrites/style.css`)).toString());

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