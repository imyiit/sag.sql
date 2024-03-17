export declare function CreateKey(values: object): string;
export declare function InsertText(values: Object, types?: Record<string, string>): {
    keys: string;
    values: string;
};
export declare function WhereText(value: Object, types: Record<string, string>): string;
export declare function UpdateText(value: object, types?: Record<string, string>): string;
