const fs = require('fs');
const path = require('path');
const newVersion = process.argv[2];

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

function compareVersions(a, b) {
    a = a.split('.').map(c => parseFloat(c));
    b = b.split('.').map(c => parseFloat(c));

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) return 1;
        if (a[i] < b[i]) return -1;
    }

    return 1;
}