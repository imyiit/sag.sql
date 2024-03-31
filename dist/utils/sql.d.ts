import type { NumericFilter, LimitType } from "../../types";
export declare function CreateKey(values: Object): string;
export declare function InsertText(values: Object): {
    keys: string;
    values: string;
};
export declare function WhereText(value: Object): string;
export declare function UpdateText(value: Object): string;
export declare function AddText(value: Object): string;
export declare function FilterText(value: Partial<NumericFilter<any>>): string;
export declare function WhereWithFilter(where_text: string, filter: string): string;
export declare function LimitText(limit: LimitType): string;
