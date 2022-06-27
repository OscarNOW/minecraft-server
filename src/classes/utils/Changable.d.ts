export class Changable {
    constructor(
        changeCallback: (values: {
            [valueName: string | symbol]: any;
        }) => void,
        startValues: {
            [valueName: string | symbol]: any;
        }
    );

    setRaw(values: {
        [valueName: string | symbol]: any;
    }): void;
    setRaw(key: string | symbol, value: any): void;

    [valueName: string | symbol]: any;
}