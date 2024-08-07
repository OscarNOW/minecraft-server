const { defaults: { title: defaults } } = require('../../../../../settings.json')

const Text = require('../../../../exports/Text');

module.exports = function (p) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    let properties = p;
    if (properties === undefined) properties = {};
    else if (typeof p === 'string' || p instanceof Text || Array.isArray(p)) properties = { title: p };

    let { fadeIn = defaults.fadeIn, stay = defaults.stay, fadeOut = defaults.fadeOut, title = defaults.title, subTitle = defaults.subTitle } = properties;

    if (!(title instanceof Text)) title = new Text(title);
    if (!(subTitle instanceof Text)) subTitle = new Text(subTitle);

    this.p.sendPacket('title', {
        action: 5
    })

    this.p.sendPacket('title', {
        action: 3,
        fadeIn,
        stay,
        fadeOut
    })

    this.p.sendPacket('title', {
        action: 0,
        text: JSON.stringify(title.chat)
    })

    if (subTitle.hash !== new Text('').hash) {
        this.p.sendPacket('title', {
            action: 1,
            text: JSON.stringify(subTitle.chat)
        })
    }
}