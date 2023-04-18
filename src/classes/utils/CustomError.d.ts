type Client = import('./Client').Client;

type Server = import('../exports/Server').Server;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/CustomError
 */
export class CustomError {
    constructor(
        type: 'expectationNotMet',
        causer: 'client' | 'libraryUser' | 'library',
        valueName: string,
        expectationInfo: {
            got: unknown;
            expectationType: 'value';
            expectation: unknown[];
        } | {
            got: unknown;
            expectationType: 'type';
            expectation: string;
            externalLink?: string;
        },
        context?: Function);

    type: 'expectationNotMet';
    causer: 'client' | 'libraryUser' | 'library';
    valueName: string;
    expectationInfo: {
        got: unknown;
        expectationType: 'value';
        expectation: unknown[];
    } | {
        got: unknown;
        expectationType: 'type';
        expectation: string;
        externalLink?: string;
    };
    readonly context: Function;

    readonly client?: Client;
    readonly server?: Server;

    readonly error: Error;
    [Symbol.toPrimitive](hint: 'string'): string;
    [Symbol.toPrimitive](hint: 'default'): string;
    [Symbol.toPrimitive](hint: 'number'): number;

    generateMessage(): string;
}