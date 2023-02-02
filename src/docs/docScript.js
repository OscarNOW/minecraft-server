/*eslint-env browser */
/*eslint-disable no-unused-vars*/

const path = `/${window.location.pathname.split('/')[1]}/`; // like /minecraft-server/
const currentVersionPath = location.pathname.split('/')[2]; // like 0.0.0

async function getVersions() {
    return (await getManifest()).versions;
}

async function getDocVersions() {
    let versions = await getVersions();

    const currentVersion = versions.find(({ path, version, name }) => (path ?? version ?? name) === currentVersionPath);
    // put currentVersion first
    versions = [currentVersion, ...versions.filter(version => version !== currentVersion)];

    versions = versions.filter(({ hasDocs }) => hasDocs);

    return versions;
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

    if (path.split('/').length > 3)
        throw new Error('Invalid path');

    const allowedVersionChars = '0123456789.abcdefghijklmnopqrstuvwxyz';

    // if version does not only include characters from allowedVersionChars
    if (version.split('').some(c => !allowedVersionChars.split('').includes(c.toLowerCase())))
        throw new Error('Invalid version');

    if (currentLocation.split('/').length > 2)
        throw new Error('Invalid currentLocation');

    const currentLocationAllowedChars = 'abcdefghijklmnopqrstuvwxyz/';

    // if currentLocation does not only include characters from currentLocationAllowedChars
    if (currentLocation.split('').some(c => !currentLocationAllowedChars.split('').includes(c.toLowerCase())))
        throw new Error('Invalid currentLocation');

    const newPath = `${path}${version}/${currentLocation}`;
    window.open(newPath, '_self');
}

(async () => {

    const versions = await getDocVersions();
    const currentVersion = versions.find(({ path, version, name }) => (path ?? version ?? name) === currentVersionPath);

    const versionDropdown = document.getElementById('versionDropdown');
    versionDropdown.innerHTML = versions.map(({ name, path }) => `<option value="${path ?? name}">${name}</option>\`).join('')`)

    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = titleElement.innerHTML.replace('x.x.x', currentVersion.name);

})();