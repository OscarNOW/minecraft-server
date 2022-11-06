const { spawn } = require('child_process');
const path = require('path');

module.exports = async function minify(update, _, error) {
    return await npmRun('minify', update, error)
}

function npmRun(command, cb, error) {
    return new Promise(res => {
        spawn('npm.cmd', ['run', command], { cwd: path.join(__dirname, '../../') })
            .on('close', code => [null, 0].includes(code) ? res() : (res(false), error(`Exited with code ${code}`)))
            .stdout.on('data', a => cb(a.toString()))
    })
}