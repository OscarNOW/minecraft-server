const fs = require('fs');
const path = require('path');

console.log('Transforming customCss...')
let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/unstable/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
customCss += `
#versionDropdownLabel {
    margin-left: 5px;
    margin-right: 5px;
}
`
fs.writeFileSync(path.resolve(__dirname, '../../docs/unstable/assets/custom.css'), customCss);

console.log('Generating index...')
const versionManifest = require('../../docs/manifest.json')
const latestStableVersion = versionManifest.versions.find(({ latestStable }) => latestStable);
const latestStableVersionPath = latestStableVersion.path ?? latestStableVersion.name;
const latestStableVersionName = latestStableVersion.name;
const index = `
<!DOCTYPE html>
<script>location = "./${latestStableVersionPath}/"</script>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${latestStableVersionName} docs minecraft-server</title>    
</head>
<body>
    Redirecting to latest stable version...
</body>
</html>
`;
console.log('Writing index...')
fs.writeFileSync(path.join(__dirname, '../../docs/index.html'), index);

console.log('Generating version dropdown...')
let versionDropdown = `<label for="versionDropdown" id="versionDropdownLabel">@</label><select id="versionDropdown" class="title" onchange="versionChange(this.value)"></select>`;

console.log('Generating version dropdown script...')
let versionDropdownScript = `
<script defer>
${fs.readFileSync(path.resolve(__dirname, './versionDropdownScript.js')).toString()}
</script>
`;

console.log('Generating menu...')
let menu = fs.readFileSync(path.resolve(__dirname, '../../docs/unstable/index.html')).toString()
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
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/unstable/classes')).map(file => `classes/${file}`),
    ...fs.readdirSync(path.resolve(__dirname, '../../docs/unstable/types')).map(file => `types/${file}`)
]) {
    console.log(`   ${file}`)

    let content = fs.readFileSync(path.resolve(__dirname, `../../docs/unstable/${file}`)).toString();

    let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
    thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

    if (file.includes('/'))
        content = content.replace(thisMenu, newInnerMenu);
    else
        content = content.replace(thisMenu, newTopMenu);

    const headLinks = [
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

        content += versionDropdownScript;

        replaced = true;
        break;
    }

    if (!replaced)
        throw new Error(`Couldn't find home link in ${file}`)

    fs.writeFileSync(path.resolve(__dirname, `../../docs/unstable/${file}`), content);
};

console.log('Writing overwrites...')
console.log('   style.css')
fs.writeFileSync(path.resolve(__dirname, `../../docs/unstable/assets/style.css`), fs.readFileSync(path.resolve(__dirname, `./overwrites/style.css`)).toString());

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