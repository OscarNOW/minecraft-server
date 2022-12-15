const { fork } = require('child_process');
const path = require('path');
const package = require('../../package.json');

module.exports = async function docs(update, { jobs, promises }, error) {
    const typesIndex = jobs.findIndex(({ name }) => name === 'types');

    await promises[typesIndex];
    return await runPackageScript('docs', update, error)
}

function runPackageScript(script, cb, error) {
    const scriptCommand = package.scripts?.[script];

    if (!scriptCommand)
        throw new Error(`Unknown script "${script}" (${typeof script})`);

    if (!scriptCommand.startsWith('node'))
        throw new Error(`Not supported script "${script}" (${typeof script})`);

    const scriptPath = path.join(__dirname, '../../', scriptCommand.split('node ').slice(1).join('node '));

    return new Promise(res => {
        let cp = fork(scriptPath, { cwd: path.join(__dirname, '../../'), stdio: 'pipe' });

        cp.on('close', code => [null, 0].includes(code) ? res() : (res(false), error(`Exited with code ${code}`)));
        cp.stdout.on('data', a => cb(a.toString()))
    })
}