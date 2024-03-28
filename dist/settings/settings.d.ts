import type { SqLiteType, DatabaseSetting } from "../../types";
export declare class Settings<Value extends Record<string, SqLiteType>> {
    table: string;
    types: Value;
    folder_name: string;
    replace: boolean;
    constructor({ table, types, folder_name, replace, }: DatabaseSetting<Value>);
}
