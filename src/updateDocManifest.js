const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../docs/manifest.json');

let manifest = JSON.parse(fs.readFileSync(manifestPath).toString());
delete manifest.versions.find(({ latestStable }) => latestStable).latestStable;
manifest.versions = manifest.versions.sort((a, b) => compareVersions(a.version, b.version)).reverse();
manifest.versions[0].latestStable = true;
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