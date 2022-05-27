module.exports = {
    inject: (injections, injecting) => {
        for (const [name, injection] of Object.entries(injections))
            if (typeof injection == 'function')
                injecting[name] = injection.bind(injecting)
            else if (
                ['boolean', 'number', 'string', 'symbol', 'undefined'].includes(typeof injection) ||
                (Array.isArray(injection) || (typeof injection == 'object' && injection !== null))
            )
                injecting[name] = injection;
            else
                throw new Error(`Couldn't inject "${require('util').inspect(injection)}" (${typeof injection})`)
    }
}