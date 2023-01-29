/*eslint-env browser */
/*eslint-disable no-unused-vars*/

const path = `/${window.location.pathname.split('/')[1]}/`; // like /minecraft-server/

let cachedVersions;
async function getVersions() {
    if (cachedVersions)
        return cachedVersions;

    cachedVersions = (await getManifest()).versions;
    return cachedVersions;
}

let cachedManifest;
async function getManifest() {
    if (cachedManifest)
        return cachedManifest;

    cachedManifest = await fetch(`${path}manifest.json`);
    cachedManifest = await cachedManifest.json();

    return cachedManifest;
}

async function versionChange(version) {
    let currentLocation = window.location.pathname.split('/').slice(3).join('/'); // like classes/Block

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

    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = titleElement.innerHTML.replace('x.x.x', currentVersion.path);

})();