const replaceableStrings = Object.freeze([
    {
        code: 's',
        validInputs: [null],
        validInputTypes: ['bigint', 'boolean', 'number', 'string', 'undefined']
    },
    {
        code: 'd',
        validInputTypes: ['bigint', 'number']
    }
])

module.exports = {
    formatJavaString: (string, ...args) => {
        for (const { code, validInputTypes, validInputs } of replaceableStrings) {
            let replaceableStringIndex = 0;
            let i = 0;

            while (true) {
                i = string.indexOf(`%${code}`, i + 1)

                if (i === -1)
                    break;

                //todo: use CustomError
                if (replaceableStringIndex > args.length - 1)
                    throw new Error(`Not enough arguments for %${code} in "${string}". Got ${args.length}, expected at least ${replaceableStringIndex + 1}`);

                const arg = args[replaceableStringIndex];

                //todo: use CustomError and make message clearer
                if ((!validInputTypes.includes(typeof arg)) && (validInputs && !validInputs.includes(arg)))
                    throw new Error(`Invalid argument type for %${code} in ${string}`);

                string = string.replace(`%${code}`, arg);
                replaceableStringIndex++;
            }
        }

        // positional arguments
        for (const { code, validInputTypes, validInputs } of replaceableStrings) {
            let i = 0;

            while (true) {
                i = string.indexOf(`$${code}`, i + 1)

                if (i === -1)
                    break;

                const argumentIndex = string.slice(0, i).split('%')[string.slice(0, i).split('%').length - 1] - 1;

                if (argumentIndex > args.length - 1)
                    throw new Error(`Not enough arguments for %${argumentIndex}$${code} in "${string}". Got ${args.length}, expected at least ${argumentIndex + 1}`); //todo: use CustomError

                const arg = args[argumentIndex];

                if ((!validInputTypes.includes(typeof arg)) && (validInputs && !validInputs.includes(arg)))
                    throw new Error(`Invalid argument type for %${argumentIndex}$${code} in ${string}`); //todo: use CustomError and make message clearer

                string = string.replace(`%${argumentIndex + 1}$${code}`, arg);
            }
        }

        string = string.replace(/%%/g, '%');

        return string;
    }
}