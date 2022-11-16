const { spawn } = require('child_process');
const path = require('path');

module.exports = async function readme(update) {
    return await npmRun('readme', update)
}

function npmRun(command, cb) {
    return new Promise(res => {
        spawn('npm.cmd', ['run', command], { cwd: path.join(__dirname, '../../') }) //todo: does not work on linux
            .on('close', res)
            .stdout.on('data', a => cb(a.toString()))
    })
}