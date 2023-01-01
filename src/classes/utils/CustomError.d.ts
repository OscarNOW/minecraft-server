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
    context: Function;

    client?: Client;
    server?: Server;

    error: Error;
    [Symbol.toPrimitive](hint: 'string'): string;
    [Symbol.toPrimitive](hint: 'default'): string;
    [Symbol.toPrimitive](hint: 'number'): number;

    generateMessage(): string;
}