const typedocName = require('../settings.json').typedoc.namedSettings.name;

module.exports = (async () => {
    const fs = require('fs');
    const fsp = fs.promises;
    const path = require('path');

    if (!fs.existsSync(path.resolve(__dirname, '../../docs/github/classes/')))
        throw new Error('Typedoc failed to generate classes folder. Exiting...');

    console.log('Transforming customCss...')
    let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/github/assets/custom.css')).toString() // todo: doesn't this add customCss to customCss each time it's run?
    customCss = customCss.replace('.category__link--ts', '.none');
    // todo: change border-radius and padding of code element
    customCss += `
#versionDropdownLabel {
    margin-left: 5px;
    margin-right: 5px;
}
.tsd-panel.tsd-typography>table {
    border: 2px solid;
    border-radius: 5px;
}
`
    fs.writeFileSync(path.resolve(__dirname, '../../docs/github/assets/custom.css'), customCss);

    console.log('Generating index...')
    const versionManifest = require('../../docs/manifest.json')

    const latestStableVersion = versionManifest.versions.find(({ latestStable }) => latestStable);
    const latestStableVersionPath = latestStableVersion.path ?? latestStableVersion.name;

    const latestUnstableVersion = versionManifest.versions.find(({ latestUnstable }) => latestUnstable);
    const latestUnstableVersionPath = latestUnstableVersion.path ?? latestUnstableVersion.name;

    const redirectionPage = fs.readFileSync(path.resolve(__dirname, './redirectionPage.html')).toString()
        .replaceAll('{path.normal}', `{pathBefore}${latestStableVersionPath}/{path}`)
        .replaceAll('{path.unstable}', `{pathBefore}${latestUnstableVersionPath}/{path}`)
        .replaceAll('{title}', `{title}x.x.x docs ${typedocName}`);

    console.log('Generating version dropdown...')
    let versionDropdown = '<label for="versionDropdown" id="versionDropdownLabel" class="title">@</label><select id="versionDropdown" class="title" onchange="versionChange(this.value)"></select>';

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

    for (const index of getAllIndexes(menu, '<li><a class="category__link js-category-link category__link--ts" href="')) {
        let value = menu.substring(index + '<li><a class="category__link js-category-link category__link--ts" href="'.length);
        value = value.substring(0, value.indexOf('</a>') + 4);

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
    let promises = [
        ['index.html', false, newTopMenu],
        ['modules.html', false, newTopMenu],
        ...fs.readdirSync(path.resolve(__dirname, '../../docs/github/classes')).map(file => [`classes/${file}`, true, newInnerMenu]),
        ...fs.readdirSync(path.resolve(__dirname, '../../docs/github/types')).map(file => [`types/${file}`, true, newInnerMenu])
    ].map(transformFile);

    await Promise.all(promises);

    async function transformFile([file, includesSlash, newMenu]) {
        let content = (await fsp.readFile(path.resolve(__dirname, `../../docs/github/${file}`))).toString();

        console.log(`Transforming ${file}...`)

        let thisMenu = content.substring(content.indexOf('<div class="tree-content">'));
        thisMenu = thisMenu.substring(0, thisMenu.indexOf('</div>') + 6);

        content = content.replace(thisMenu, newMenu);

        const homeLinks = [
            `<a href="../index.html" class="title">${typedocName}</a>`,
            `<a href="index.html" class="title">${typedocName}</a>`,
            `<a href="" class="title">${typedocName}</a>`
        ];
        let replaced = false;

        for (const homeLink of homeLinks) {
            if (!content.includes(homeLink)) continue;

            let versionDropdownIndex = content.indexOf(homeLink) + homeLink.length - 1;
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

        let name = '';
        if (includesSlash)
            name = file.split('/')[1].split('.html')[0] + ' ';

        content = content.split('<title>');
        content[1] = content[1].split('</title>')[1];
        content.splice(1, 0, `<title>${name}x.x.x docs minecraft-server</title>`);
        content = content.join('');

        await fsp.writeFile(path.resolve(__dirname, `../../docs/github/${file}`), content);

        let filePath = '';
        if (includesSlash)
            filePath = file.split('.html')[0];

        let folder = file.split('/').slice(0, -1).join('/');

        if (folder !== '')
            await fsp.mkdir(path.join(__dirname, '../../docs/', folder), { recursive: true });

        let pathBefore;
        if (file.split('/').length === 1)
            pathBefore = './';
        else
            pathBefore = '../'.repeat(file.split('/').length - 1);

        fsp.writeFile(path.join(__dirname, `../../docs/${file}`), redirectionPage.replaceAll('{path}', filePath).replaceAll('{title}', name).replaceAll('{pathBefore}', pathBefore).replaceAll('\r\n', '\n'));
        console.log(`   ${file}`);

    };

    console.log('Writing overwrites...')
    console.log('   style.css')
    fs.writeFileSync(path.resolve(__dirname, '../../docs/github/assets/style.css'), fs.readFileSync(path.resolve(__dirname, './overwrites/style.css')).toString());

    console.log('Copying files...')
    console.log('    index.d.ts')
    fs.copyFileSync('./index.d.ts', './docs/github/index.d.ts');

    function getAllIndexes(str, val) { //todo: use (already existent) function file
        let indexes = [];
        let i = 0;

        while (i !== -1) {
            i = str.indexOf(val, i + 1)

            if (i !== -1)
                indexes.push(i);
        }

        return indexes;
    }
})();