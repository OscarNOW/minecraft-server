const fs = require('fs');
const path = require('path');
const newVersion = process.argv[2];

if (newVersion !== undefined) {
    let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
    package.version = newVersion;
    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(package, null, 4));
}

const manifestPath = path.join(__dirname, '../docs/manifest.json');

let manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

if (newVersion !== undefined)
    manifest.versions.push({
        version: newVersion,
        name: newVersion,
        path: newVersion
    })

delete manifest.versions.find(({ latestStable }) => latestStable)?.name;
delete manifest.versions.find(({ latestStable }) => latestStable)?.latestStable;

manifest.versions = [...(manifest.versions.filter(({ unstable }) => !unstable)?.sort((a, b) => compareVersions(a.version, b.version))?.reverse?.() || []), ...(manifest.versions.filter(({ unstable }) => unstable) || [])];

manifest.versions[0].latestStable = true;
manifest.versions[0].name = `${manifest.versions[0].version} (latest stable)`;

fs.writeFileSync(manifestPath, JSON.stringify(manifest));

let bugReport = fs.readFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml')).toString();
bugReport = bugReport.split('\n');

let versionLineStartIndex = bugReport.find(a => a.includes('#startVersionOptions')) + 1;
let versionLineEndIndex = bugReport.find(a => a.includes('#endVersionOptions')) - 1;

let newVersions = manifest.versions.map(({ name }) => name).map(a => `        - ${a}`);

bugReport = [...bugReport.slice(0, versionLineStartIndex), ...newVersions, ...bugReport.slice(versionLineEndIndex)];

bugReport = bugReport.join('\n');

fs.writeFileSync(path.join(__dirname, '../.github/ISSUE_TEMPLATE/bug_report.yml'), bugReport)

function compareVersions(a, b) {
    a = a.split('.').map(c => parseInt(c));
    b = b.split('.').map(c => parseInt(c));

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) return 1;
        if (a[i] < b[i]) return -1;
    }

    return 1;
}