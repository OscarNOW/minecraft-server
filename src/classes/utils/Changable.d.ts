export class Changable {
    constructor(
        changeCallback: (values: {
            [valueName: string | symbol]: unknown;
        }, oldValues: {
            [valueName: string | symbol]: unknown;
        }) => void,
        startValues: {
            [valueName: string | symbol]: unknown;
        }
    );

    setRaw(values: {
        [valueName: string | symbol]: unknown;
    }): void;
    setRaw(key: string | symbol, value: unknown): void;

    readonly raw: {
        [valueName: string | symbol]: unknown;
    };

    [valueName: string | symbol]: unknown;
}