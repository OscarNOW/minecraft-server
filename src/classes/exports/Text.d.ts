export class Text {
    constructor(text: textInput);

    array: textArray;
    string: string;
    uncolored: string;
    readonly chat: chatComponent;

    readonly hash: string;

    toString(): string;

    static stringToArray(text: string): textArray;
    static stringToUncolored(text: string): string;
    static parseArray(text: optionalTextArray): textArray;
    static arrayToString(text: optionalTextArray): string;
    static arrayToChat(text: optionalTextArray): chatComponent;
    static parseChat(text: chatComponent): chatComponent;
    static minifyChat(text: chatComponent): chatComponent;
}
type textInput = string | optionalTextArray;

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

type chatComponent = string | number | boolean | chatComponent[] | {
    text: string;

    extra?: chatComponent[];

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    color?: minecraftTextColor;

    //Not implemented
    /*
    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };
    //*/

};
//Not implemented
/*| {
    translate: chatTranslate;
    with?: chatComponents;

    extra?: chatComponents;

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    color?: minecraftTextColor;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };
} | {
    keybind: keycode;

    extra?: chatComponents;

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    color?: minecraftTextColor;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };
} | {
    score: {
        name: string;
        objective: string;
        value: number;
    };

    extra?: chatComponents;

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    color?: minecraftTextColor;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };
};
//*/