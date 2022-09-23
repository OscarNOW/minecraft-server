export class CustomError {
    constructor(
        type: 'expectationNotMet',
        causer: 'client' | 'libraryUser' | 'library',
        valueName: string,
        expectationInfo: {
            got: any;
            expectationType: 'value';
            expectation: unknown[];
        } | {
            got: any;
            expectationType: 'type';
            expectation: string;
            externalLink?: string;
        },
        context?: Function);

    type: 'expectationNotMet';
    causer: 'client' | 'libraryUser' | 'library';
    valueName: string;
    expectationInfo: {
        got: any;
        expectationType: 'value';
        expectation: unknown[];
    } | {
        got: any;
        expectationType: 'type';
        expectation: string;
        externalLink?: string;
    };
    context: Function;

    error: Error;
    [Symbol.toPrimitive](hint: 'string'): Error;
    [Symbol.toPrimitive](hint: 'default'): Error;
    [Symbol.toPrimitive](hint: 'number'): number;

    generateMessage(): string;
}