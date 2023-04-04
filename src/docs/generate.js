(async () => {

    const fs = require('fs').promises;
    const path = require('path');
    const exec = require('util').promisify(require('child_process').exec);

    const settings = require('../settings.json');

    console.log('Copying files...')

    let copyingFiles = [
        'index.d.ts'
    ];

    let copiedFilePromises = [];

    for (const copyingFile of copyingFiles) {
        console.log(`    ${copyingFile}`)

        copiedFilePromises.push(fs.copyFile(
            path.join(__dirname, `../../${copyingFile}`),
            path.join(__dirname, `./${copyingFile}`)
        ));
    }

    console.log('    .github/README.md')
    copiedFilePromises.push(fs.copyFile(
        path.join(__dirname, '../../.github/README.md'),
        path.join(__dirname, './README.md')
    ));

    await Promise.all(copiedFilePromises);

    console.log('Deleting old files...')

    await fs.rm(path.join(__dirname, '../../docs/github/'), { recursive: true, force: true });
    await fs.mkdir(path.join(__dirname, '../../docs/github/'))

    require('./transformBefore.js');

    console.log('Generating docs...')

    const command = [
        'typedoc',
        settings.typedoc.paths.types,
        `--readme ${settings.typedoc.paths.readme}`,
        `--tsconfig ${settings.typedoc.paths.tsconfig}`,
        `--out ${settings.typedoc.paths.out}`,
        `--plugin ${settings.typedoc.paths.plugin}`,
        ...settings.typedoc.sort.map(a => `--sort ${a}`),
        ...Object.entries(settings.typedoc.namedSettings).map(([name, value]) => `--${name} ${value}`),
        ...settings.typedoc.settings.map(a => `--${a}`),
        ...settings.typedoc.arguments
    ].join(' ');

    console.log(command)
    await exec(command);

    await require('./transformAfter.js');

    console.log('Copying assets...')

    copyingFiles = [
        'assets'
    ];
    copiedFilePromises = [];

    for (const copyingFile of copyingFiles) {
        console.log(`   ${copyingFile}`)

        copiedFilePromises.push(fs.cp(
            path.join(__dirname, `../../${copyingFile}`),
            path.join(__dirname, `../../docs/github/${copyingFile}`),
            { recursive: true }
        ));
    }

    await Promise.all(copiedFilePromises);

    console.log('Done generating docs')

})();