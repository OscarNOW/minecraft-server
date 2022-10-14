/*eslint-env browser */
/*eslint-disable no-unused-vars*/

const path = '/minecraft-server/'

let cachedVersions;
async function getVersions() {
    if (cachedVersions)
        return cachedVersions;

    cachedVersions = (await getManifest()).versions;
    return cachedVersions;
}

let manifest;
async function getManifest() {
    if (manifest)
        return manifest;

    manifest = await fetch(`${path}manifest.json`);
    manifest = await manifest.json();

    return manifest;
}

async function versionChange(version) {
    let currentLocation = window.location.href.split(path).pop().split('/');
    currentLocation = currentLocation.slice(1, currentLocation.length).join('/');

    location = `${path}${version}/${currentLocation}`;
}

(async () => {

    let versions = await getVersions();
    let currentVersion = location.pathname.split('/')[2];

    currentVersion = versions.find(({ name, path }) => (path ?? name) === currentVersion);
    versions = versions.filter(({ path }) => path !== currentVersion.path);
    versions = [currentVersion, ...versions];

    const versionDropdown = document.getElementById('versionDropdown');
    versionDropdown.innerHTML = versions.map(({ name, path }) => `<option value="${path ?? name}">${name}</option>\`).join('')`)

})();