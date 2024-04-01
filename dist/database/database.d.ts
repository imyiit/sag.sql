import type { SqLiteType, DatabaseSetting, SqlReturnTypes, OptionType, SqlNumericReturnTypes } from "../../types";
export declare class Database<Value extends Record<string, SqLiteType>> {
    private table;
    types: Value;
    private folder_name;
    private replace;
    private db;
    constructor({ table, types, folder_name, replace, }: DatabaseSetting<Value>);
    set(value: SqlReturnTypes<Value>): this;
    private find;
    findAll(value: Partial<SqlReturnTypes<Value>>, options?: OptionType<Value>): [] | SqlReturnTypes<Value>[];
    findOne(value: Partial<SqlReturnTypes<Value>>, options?: Omit<OptionType<Value>, "limit">): SqlReturnTypes<Value> | undefined;
    update({ where, value, }: {
        where?: Partial<SqlReturnTypes<Value>>;
        value?: Partial<SqlReturnTypes<Value>>;
    }, options?: Omit<OptionType<Value>, "get">): this;
    add({ value, where, }: {
        where?: Partial<SqlReturnTypes<Value>>;
        value?: Partial<SqlNumericReturnTypes<Value>>;
    }, options?: Omit<OptionType<Value>, "get">): this;
    delete(where?: Partial<SqlReturnTypes<Value>>, options?: Omit<OptionType<Value>, "get">): this;
    deleteAll(): this;
    all(): SqlReturnTypes<Value>[];
}
