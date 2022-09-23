export class CustomError {
    constructor(
        type: 'expectationNotMet',
        causer: 'client' | 'libraryUser' | 'library',
        names: string[][],
        expectationInfo: {
            got: any;
            expectationType: 'value';
            expectation: any[];
        } | {
            got: any;
            expectationType: 'type';
            expectation: string;
            externalLink?: string;
        },
        context?: Function);

    type: 'expectationNotMet';
    cause: 'client' | 'libraryUser';
    names: {
        value: string;
        function: string;
        class: string;
    };
    expectationInfo: {
        got: any;
        expectationType: 'value';
        expectation: any[];
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

    private generateMessage(): string;
}