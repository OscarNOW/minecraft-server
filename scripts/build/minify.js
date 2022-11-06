const { spawn } = require('child_process');
const path = require('path');

module.exports = function minify(update) {
    return new Promise(res => {
        spawn('npm.cmd', ['run', 'minify'], { cwd: path.join(__dirname, '../../') })
            .on('close', res)
            .stdout.on('data', update)
    })
}