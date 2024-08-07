const fs = require('fs');
const path = require('path');
const newVersion = process.argv[2];

const { compareDotSeparatedStrings } = require('../src/functions/compareDotSeparatedStrings.js');

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
        name: newVersion, //todo: rename name to displayName
        path: newVersion,
        hasDocs: true,
        hasSupport: true
    });

//reset latest stable
if (manifest.versions.find(({ latestStable }) => latestStable))
    delete manifest.versions.find(({ latestStable }) => latestStable).latestStable;

const unstableVersions = manifest.versions.filter(({ unstable }) => unstable)?.sort((a, b) => compareDotSeparatedStrings(a.version, b.version))?.reverse?.() || [];
const stableVersions = manifest.versions.filter(({ unstable }) => !unstable)?.sort((a, b) => compareDotSeparatedStrings(a.version, b.version))?.reverse?.() || [];

manifest.versions = [
    stableVersions[0],
    ...unstableVersions,
    ...stableVersions.slice(1)
];

manifest.versions.find(({ unstable }) => !unstable).latestStable = true;

manifest.versions = manifest.versions.map(a => {
    a.name = generateVersionDisplayName(a);
    return a;
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest));

// Update bug report issue template
let bugReport = fs.readFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml')).toString();
bugReport = bugReport.split('\n');

const versionLineStartIndex = bugReport.findIndex(a => a.includes('#startVersionOptions')) + 1;
const versionLineEndIndex = bugReport.findIndex(a => a.includes('#endVersionOptions'));

const supportedVersionNames = manifest.versions
    .filter(({ hasSupport }) => hasSupport)
    .map(({ name }) => name)
    .map(a => `        - ${a}`);

bugReport = [
    ...bugReport.slice(0, versionLineStartIndex),
    ...supportedVersionNames,
    '        - other (specify in additional information)',
    ...bugReport.slice(versionLineEndIndex)
];

bugReport = bugReport.join('\n');
bugReport = bugReport.replaceAll('\r\n', '\n');

fs.writeFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml'), bugReport);

function generateVersionDisplayName(version) {
    let name = version.path;

    if (!version.hasSupport)
        name += ' (no support)';

    if (!version.hasDocs)
        name += ' (no docs)';

    if (version.unstable)
        name += ' (unstable)';

    if (version.latestStable)
        name += ' (latest stable)';

    return name;
}
