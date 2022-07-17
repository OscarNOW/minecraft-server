export class Text {
    // constructor(text: string | optionalTextArray | chat);
    constructor(text: string | optionalTextArray);

    array: textArray;
    string: string;
    // chat: chat;

    toString(): string;

    static stringToArray(text: string): textArray;
    static parseArray(text: optionalTextArray): textArray;
    static arrayToString(text: optionalTextArray): string;
    static parseString(text: string): string;
    // static stringToChat(text: string): chat;
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

type chat = {
    text: string;

    extra?: chatComponents;

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    font?: 'minecraft:uniform' | 'minecraft:alt' | 'minecraft:default';
    color?: string;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };

} | {
    translate: chatTranslate;
    with?: chatComponents;

    extra?: chatComponents;

    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;

    font?: 'minecraft:uniform' | 'minecraft:alt' | 'minecraft:default';
    color?: string;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard';
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

    font?: 'minecraft:uniform' | 'minecraft:alt' | 'minecraft:default';
    color?: string;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard';
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

    font?: 'minecraft:uniform' | 'minecraft:alt' | 'minecraft:default';
    color?: string;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard';
        value: string | number;
    };
    hoverEvent?: {
        action: 'show_text' | 'show_item' | 'show_entity';
        value: chatComponent;
    };
};

type chatComponents = chatComponent[];
type chatComponent = chat | string | chatComponents;