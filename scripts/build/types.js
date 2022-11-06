const { spawn } = require('child_process');
const path = require('path');

module.exports = async function types(update) {
    await npmRun('types', update)
}

function npmRun(command, cb) {
    return new Promise(res => {
        spawn('npm.cmd', ['run', command], { cwd: path.join(__dirname, '../../') })
            .on('close', res)
            .stdout.on('data', a => cb(a.toString()))
    })
}