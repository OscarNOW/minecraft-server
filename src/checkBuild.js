const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const exec = require('util').promisify(require('child_process').exec);

(async () => {

    let docsHashBefore;
    let dataHashBefore;

    if (fs.existsSync(path.join(__dirname, '../docs/')))
        docsHashBefore = generateHash(path.join(__dirname, '../docs/'));
    if (fs.existsSync(path.join(__dirname, './data/')))
        dataHashBefore = generateHash(path.join(__dirname, './data/'));

    await exec('npm run minify');
    await exec('npm run types');
    await exec('npm run docs');

    let docsHashAfter;
    let dataHashAfter;

    if (fs.existsSync(path.join(__dirname, '../docs/')))
        docsHashAfter = generateHash(path.join(__dirname, '../docs/'));
    if (fs.existsSync(path.join(__dirname, './data/')))
        dataHashAfter = generateHash(path.join(__dirname, './data/'));

    console.log('docsHashBefore', docsHashBefore);
    console.log('docsHashAfter', docsHashAfter)
    console.log()
    console.log('dataHashBefore', dataHashBefore);
    console.log('dataHashAfter', dataHashAfter)

    if (docsHashBefore === undefined || docsHashBefore !== docsHashAfter)
        failed();
    if (dataHashBefore === undefined || dataHashBefore !== dataHashAfter)
        failed();

})();

function failed() {
    console.log()
    console.log()
    console.log('New build does not match with committed build. Please run "npm run compile" before committing')
    process.exit(1);
}

function generateHash(hashPath) {
    if (fs.lstatSync(hashPath).isFile())
        return crypto.createHash('sha256').update(`${hashPath}-${fs.readFileSync(hashPath)}`).digest('base64');

    let contents = `${hashPath}+`;

    for (const fileName of fs.readdirSync(hashPath))
        contents += generateHash(path.join(hashPath, fileName));

    contents += '=';

    console.log('contents', contents);

    return crypto.createHash('sha256').update(contents).digest('hex');
}