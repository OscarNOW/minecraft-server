const { statistics } = require('../properties/public/dynamic/statistics.js');

module.exports = {
    client_command({ actionId }) {
        if (actionId === 0)
            this.p.emit('respawn');
        else {
            statistics.sendToClient.call(this);
            this.p.emit('statisticsOpen');
        }
    }
}