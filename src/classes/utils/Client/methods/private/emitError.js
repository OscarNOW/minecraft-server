module.exports = {
    emitError(customError) {
        if (customError.causer == 'client')
            if (this.p.events.misbehavior.length > 0)
                this.p.emit('misbehavior', customError);
            else
                throw customError;
        else {
            if (this.server.globals.serverEvents.get(this.server).error.length > 0)
                for (const callback of this.server.globals.serverEvents.get(this.server).error)
                    callback(customError);
            else
                throw customError;
        }
    }
}