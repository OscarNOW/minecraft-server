const { spawn } = require('child_process');
const path = require('path');

module.exports = async function minify(update) {
    await npmRun('minify', update)
}

function npmRun(command, cb) {
    return new Promise((res, rej) => {
        spawn('npm.cmd', ['run', command], { cwd: path.join(__dirname, '../../') })
            .on('close', code => code === 0 ? res : rej(`Exit code "${code}"`))
            .stdout.on('data', a => cb(a.toString()))
    })
}