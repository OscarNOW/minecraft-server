const Text = require('../../../../../exports/Text.js');

module.exports = {
    tabFooter: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._tabFooter;
        },
        set: function (v, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            let newValue = v;
            if (!(newValue instanceof Text))
                newValue = new Text(newValue);

            const oldValue = this.tabFooter;
            this.p._tabFooter = newValue;

            this.p.sendPacket('playerlist_header', {
                header: JSON.stringify(this.tabHeader.chat),
                footer: JSON.stringify(newValue.chat)
            })

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('tabFooter', oldValue);
        },
        init: function () {
            this.p._tabFooter = new Text('');
        }
    }
}