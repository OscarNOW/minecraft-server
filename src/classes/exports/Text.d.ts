export class Text {
    constructor(text: textInput);

    array: textArrayComponent[];
    string: string;
    uncolored: string;
    readonly chat: chatComponent;

    readonly hash: string;

    toString(): string;

    static stringToArray(text: string): textArrayComponent[];
    static stringToUncolored(text: string): string;
    static parseArray(text: optionalTextArray): textArrayComponent[];
    static arrayToString(text: optionalTextArray): string;
    static arrayToChat(text: optionalTextArray): chatComponent;
    static parseChat(text: chatComponent): chatComponent;
    static minifyChat(text: chatComponent): chatComponent;
}
type textInput = string | optionalTextArray;

type textArrayComponent = {
    text: string;
    color: textColor;
    modifiers: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; // todo: convert to better names
        value: string | number;
    };
    hoverEvent?: { //todo: change to hoverText
        action: 'show_text'; // todo: convert to better name
        value: textArrayComponent[];
    };
} | {
    keybind: keycode;
    color: textColor;
    modifiers: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; // todo: convert to better names
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text'; // todo: convert to better name
        value: textArrayComponent;
    };
};

type optionalTextArray = optionalTextArrayComponent[] | optionalTextArrayComponent;
type optionalTextArrayComponent = string | {
    text?: string;
    color?: textColor;
    modifiers?: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; // todo: convert to better name
        value: string | number;
    };
    hoverEvent?: { //todo: change to hoverText
        action: 'show_text'; // todo: convert to better name
        value: optionalTextArray;
    };
} | {
    keybind?: keycode;
    color?: textColor;
    modifiers?: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; // todo: convert to better name
        value: string | number;
    };
    hoverEvent?: { //todo: change to hoverText
        action: 'show_text'; // todo: convert to better name
        value: optionalTextArray;
    };
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

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text';
        value: chatComponent;
    };

} | {
    keybind: keycode;

    extra?: chatComponent[];

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
        action: 'show_text';
        value: chatComponent;
    };
};
//Not implemented
/*| {
    translate: chatTranslate;
    with?: chatComponents;

    extra?: chatComponents; //chatComponents doesn't exist

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

    extra?: chatComponents; //chatComponents doesn't exist

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