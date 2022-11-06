const { spawn } = require('child_process');
const path = require('path');

module.exports = async function docs(update, { jobs, promises }) {
    const typesIndex = jobs.findIndex(({ name }) => name === 'types');

    await promises[typesIndex];
    return await npmRun('docs', update)
}

function npmRun(command, cb) {
    return new Promise(res => {
        spawn('npm.cmd', ['run', command], { cwd: path.join(__dirname, '../../') })
            .on('close', res)
            .stdout.on('data', a => cb(a.toString()))
    })
}