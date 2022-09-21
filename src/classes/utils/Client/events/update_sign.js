module.exports = {
    update_sign: function ({ text1, text2, text3, text4, location }) {
        this.p.emit('signEditorClose', [text1, text2, text3, text4], location);
    }
}