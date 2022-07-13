export class Text {
    constructor(text: string | optionalTextArray);

    array: textArray;
    string: string;

    static stringToArray(text: string): textArray;
    static parseArray(text: optionalTextArray): textArray;
    static arrayToString(text: optionalTextArray): string;
    static parseString(text: string): string;
}

type textArray = Array<{
    text: string;
    color: textColor;
    modifiers: Array<textModifier>;
}>;

type optionalTextArray = Array<{
    text: string;
    color?: textColor;
    modifiers?: Array<textModifier>;
} | string> | {
    text: string;
    color?: textColor;
    modifiers?: Array<textModifier>;
};