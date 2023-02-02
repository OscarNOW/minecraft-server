const fs = require('fs');
const path = require('path');
const newVersion = process.argv[2];

// Update version in package.json
if (newVersion !== undefined) {
    let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
    package.version = newVersion;
    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(package, null, 4));

    let packageLock = JSON.parse(fs.readFileSync(path.join(__dirname, '../package-lock.json')).toString());
    packageLock.version = newVersion;
    packageLock.packages[''].version = newVersion;
    fs.writeFileSync(path.join(__dirname, '../package-lock.json'), JSON.stringify(packageLock, null, 4));

    let changelog = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md')).toString();
    changelog = changelog.replaceAll('{version}', newVersion);
    fs.writeFileSync(path.join(__dirname, '../CHANGELOG.md'), changelog);
}

// Update manifest
const manifestPath = path.join(__dirname, '../docs/manifest.json');

let manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

if (newVersion !== undefined)
    manifest.versions.push({
        version: newVersion,
        name: newVersion,
        path: newVersion
    })

if (manifest.versions.find(({ latestStable }) => latestStable))
    manifest.versions.find(({ latestStable }) => latestStable).name =
        manifest.versions.find(({ latestStable }) => latestStable).path;

delete manifest.versions.find(({ latestStable }) => latestStable)?.latestStable; //todo: why is this here?

manifest.versions = [...(manifest.versions.filter(({ unstable }) => unstable) || []), ...(manifest.versions.filter(({ unstable }) => !unstable)?.sort((a, b) => compareVersions(a.version, b.version))?.reverse?.() || [])];

manifest.versions.find(({ unstable }) => !unstable).latestStable = true;
manifest.versions.find(({ unstable }) => !unstable).name = `${manifest.versions.find(({ unstable }) => !unstable).version} (latest stable)`;

fs.writeFileSync(manifestPath, JSON.stringify(manifest));

// Update bug report issue template
let bugReport = fs.readFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml')).toString();
bugReport = bugReport.split('\n');

const versionLineStartIndex = bugReport.findIndex(a => a.includes('#startVersionOptions')) + 1;
const versionLineEndIndex = bugReport.findIndex(a => a.includes('#endVersionOptions'));

const supportedVersionNames = manifest.versions.filter(({ hasSupport }) => hasSupport).map(({ name }) => name).map(a => `        - ${a}`);

bugReport = [...bugReport.slice(0, versionLineStartIndex), ...supportedVersionNames, ...bugReport.slice(versionLineEndIndex)];

bugReport = bugReport.join('\n');
bugReport = bugReport.replaceAll('\r\n', '\n');

fs.writeFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml'), bugReport);

function compareVersions(a, b) { //todo: move to function file
    a = a.split('.').map(c => parseInt(c));
    b = b.split('.').map(c => parseInt(c));

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) return 1;
        if (a[i] < b[i]) return -1;
    }

    return 0;
}