import type { SqLiteType, DatabaseSetting, SqlValueTypes, OptionType, SqlNumericReturnTypes, SqlReturnTypes } from "../../types";
export declare class Database<Value extends Record<string, SqLiteType>> {
    private table;
    types: Value;
    private folder_name;
    private replace;
    private db;
    constructor({ table, types, folder_name, replace, }: DatabaseSetting<Value>);
    set(value: SqlValueTypes<Value>): this;
    private find;
    findAll(value: Partial<SqlValueTypes<Value>>, options?: OptionType<Value>): [] | SqlReturnTypes<Value>[];
    findOne(value: Partial<SqlValueTypes<Value>>, options?: Omit<OptionType<Value>, "limit">): SqlReturnTypes<Value> | undefined;
    update({ where, value, }: {
        where?: Partial<SqlValueTypes<Value>>;
        value?: Partial<SqlValueTypes<Value>>;
    }, options?: Omit<OptionType<Value>, "get">): this;
    add({ value, where, }: {
        where?: Partial<SqlValueTypes<Value>>;
        value?: Partial<SqlNumericReturnTypes<Value>>;
    }, options?: Omit<OptionType<Value>, "get">): this;
    delete(where?: Partial<SqlValueTypes<Value>>, options?: Omit<OptionType<Value>, "get">): this;
    deleteAll(): this;
    all(): SqlValueTypes<Value>[];
}
