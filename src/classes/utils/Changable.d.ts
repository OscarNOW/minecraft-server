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

    [valueName: string | symbol]: any;
}