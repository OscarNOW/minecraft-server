type textColor = import('../../types').textColor;
type textModifier = import('../../types').textModifier;
type keycode = import('../../types').keycode;
type chatTranslate = import('../../types').chatTranslate;
type minecraftTextColor = import('../../types').minecraftTextColor;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Text
 */
export class Text {
    /**
     * @example
     *          const message = new Text([
     *              {
     *                  text: 'Hello ',
     *                  color: 'darkGreen',
     *                  modifiers: [
     *                      'bold',
     *                      'italic'
     *                  ]
     *              },
     *              {
     *                  text: 'world',
     *                  color: 'purple',
     *                  modifiers: [
     *                      'underline',
     *                      'strike'
     *                  ]
     *              }
     *         ]);
     *
     */
    constructor(text: textInput);

    array: textArrayComponent[];
    string: string;
    uncolored: string;
    readonly chat: chatComponent;

    readonly hash: string;

    [Symbol.toPrimitive](hint: 'string'): string;
    [Symbol.toPrimitive](hint: 'number'): number;
    [Symbol.toPrimitive](hint: 'default'): textArrayComponent[];

    removeAllListeners(event?: 'change'): void;

    on(event: 'change', listener: (text: Text) => void): void;
    once(event: 'change', listener: (text: Text) => void): void;

    static stringToArray(text: string): textArrayComponent[];
    static stringToUncolored(text: string): string;
    static parseArray(text: optionalTextArray): textArrayComponent[];
    static arrayToString(text: optionalTextArray): string;
    static arrayToChat(text: optionalTextArray): chatComponent;
    static parseChat(text: chatComponent): chatComponent;
    static minifyChat(text: chatComponent): chatComponent;
}

type textArrayComponent = {
    text: string;
    color: textColor;
    modifiers: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: textArrayComponent[];
} | {
    keybind: keycode;
    color: textColor;
    modifiers: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: textArrayComponent[];
} | {
    translate: chatTranslate;
    with: textArrayComponent[]; //todo: maybe give better name

    color: textColor;
    modifiers: textModifier[];

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: textArrayComponent[];
};

type textInput = optionalTextArray;
type optionalTextArray = optionalTextArrayComponent[] | optionalTextArrayComponent;

type optionalTextArrayComponent = string | number | boolean | {
    text: string;
    color?: textColor;
    modifiers?: textModifier[] | textModifier;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: optionalTextArray;
} | {
    keybind: keycode;
    color?: textColor;
    modifiers?: textModifier[] | textModifier;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: optionalTextArray;
} | {
    translate: chatTranslate;
    with?: optionalTextArray; //todo: maybe give better name

    color?: textColor;
    modifiers?: textModifier[] | textModifier;

    insertion?: string;
    clickEvent?: {
        action: 'open_url' | 'run_command' | 'suggest_command' | 'change_page'; //todo: convert to better names
        value: string | number;
    };
    hoverText: optionalTextArray;
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

} | {
    translate: chatTranslate;
    with?: chatComponent[];

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
/* | {
    score: {
        name: string;
        objective: string;
        value: number;
    };

    //copy from other
};
//*/