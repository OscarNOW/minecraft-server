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
} | string>;

type textColor = 'darkRed' | 'red' | 'gold' | 'yellow' | 'darkGreen' | 'green' | 'aqua' | 'darkAqua' | 'darkBlue' | 'blue' | 'pink' | 'purple' | 'white' | 'gray' | 'darkGray' | 'black' | 'default';

type textModifier = 'bold' | 'italic' | 'underline' | 'strike' | 'random';