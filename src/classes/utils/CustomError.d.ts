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
    toString(): Error;

    private generateMessage(): string;
}