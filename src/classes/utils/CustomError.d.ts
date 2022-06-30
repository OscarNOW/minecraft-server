export class CustomError {
    constructor(
        type: 'expectationNotMet',
        causer: 'client' | 'libraryUser' | 'library',
        names: Array<Array<string, string>>,
        expectationInfo: {
            got: any;
            expectationType: 'value';
            expectation: any[];
        } | {
            got: any;
            expectationType: 'type';
            expectation: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'undefined' | 'null';
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
        expectation: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'undefined' | 'null';
    };
    context: Function;

    error: Error;
    toString(): Error;

    private generateMessage(): string;
}