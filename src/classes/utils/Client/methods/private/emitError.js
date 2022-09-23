module.exports = {
    emitError(customError) {
        if (customError.causer == 'client')
            if (this.p.events.misbehavior.length > 0)
                this.p.emit('misbehavior', customError);
            else
                throw customError.toString();
        else
            this.server.p.emitError(customError);
    }
}