import type { FilterOptions, LimitType } from "..";
export declare function CreateKey(values: object): string;
export declare function InsertText(values: Object, types?: Record<string, string>): {
    keys: string;
    values: string;
};
export declare function WhereText(value: Object, types: Record<string, string>): string;
export declare function UpdateText(value: object, types?: Record<string, string>): string;
export declare function AddText(value: object, types?: Record<string, string>): string;
export declare function FilterText(value: Partial<FilterOptions<any>>): string;
export declare function WhereWithFilter(where_text: string, filter: string): string;
export declare function LimitText(limit: LimitType): string;
