module.exports = {
    emitError(customError) {
        if (customError.causer === 'client')
            if (this.p.events.misbehavior?.length > 0)
                this.p.emit('misbehavior', customError);
            else
                setTimeout(() => { // to avoid unhandled promise rejection, but instead show error stack
                    throw customError.toString();
                }, 0);
        else
            this.server.p.emitError(customError);
    }
}