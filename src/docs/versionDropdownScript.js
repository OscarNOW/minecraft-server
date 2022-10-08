/*eslint-env browser */
/*eslint-disable no-unused-vars*/

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

    manifest = await fetch(`/minecraft-server/manifest.json`);
    manifest = await manifest.json();

    return manifest;
}

async function versionChange(version) {
    location = `/minecraft-server/${version}/`
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