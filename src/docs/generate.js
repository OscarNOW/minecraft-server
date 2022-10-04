(async () => {

    console.clear();
    console.log('Copying files...')

    const fs = require('fs').promises;
    const path = require('path');
    const exec = require('util').promisify(require('child_process').exec);

    let copyingFiles = [
        'index.d.ts',
        'Readme.md'
    ];

    let copiedFilePromises = [];

    for (const copyingFile of copyingFiles)
        copiedFilePromises.push(fs.copyFile(
            path.join(__dirname, `../../${copyingFile}`),
            path.join(__dirname, `./${copyingFile}`)
        ));

    await Promise.all(copiedFilePromises);

    console.clear();
    console.log('Deleting old files...')

    await fs.rm(path.join(__dirname, '../../docs/'), { recursive: true, force: true });
    await fs.mkdir(path.join(__dirname, '../../docs/'))

    console.clear();
    require('./transformBefore.js');

    console.clear();
    console.log('Generating docs...')

    await exec([
        'typedoc',
        './src/docs/index.d.ts',
        '--readme ./src/docs/Readme.md',
        '--tsconfig ./src/docs/tsconfig.json',
        '--out ./docs',
        '--plugin ./node_modules/typedoc-theme-hierarchy/dist/index.js',
        '--theme hierarchy',
        '--name "minecraft-server"',
        '--disableSources',
        '--sort visibility',
        '--sort static-first',
        '--sort alphabetical',
        '--gitRemote origin',
        '--hideGenerator'
    ].join(' '));

    require('./transformAfter.js');

    console.clear();
    console.log('Copying assets')

    copyingFiles = [
        'assets'
    ];
    copiedFilePromises = [];

    for (const copyingFile of copyingFiles)
        copiedFilePromises.push(fs.cp(
            path.join(__dirname, `../../${copyingFile}`),
            path.join(__dirname, `../../docs/${copyingFile}`),
            { recursive: true }
        ));

    await Promise.all(copiedFilePromises);

    console.clear();
    console.log('Done!')

})();