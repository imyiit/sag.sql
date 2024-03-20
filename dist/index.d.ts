type INTAGER = "INT" | "INTEGER" | "TINYINT" | "SMALLINT" | "MEDIUMINT" | "BIGINT" | "UNSIGNED BIG INT" | "INT2" | "INT8";
type TEXT = "CHARACTER(20)" | "VARCHAR(255)" | "VARYING CHARACTER(255)" | "NCHAR(55)" | "NATIVE CHARACTER(70)" | "NVARCHAR(100)" | "TEXT" | "CLOB";
type NUMERIC = "NUMERIC" | `DECIMAL(10, 5)` | "BOOLEAN" | "DATE" | "DATETIME";
type REAL = "REAL" | "DOUBLE" | "DOUBLE PRECISION" | "FLOAT";
type NONE = "BLOB";
type AllSqlProps = TEXT | INTAGER | NUMERIC | REAL | NONE;
type SqlProps<T extends string> = `${T}${" NOT NULL" | ""}${" UNIQUE" | ""}${" PRIMARY KEY" | ""}`;
export type SqLiteType = SqlProps<AllSqlProps>;
export type DatabaseSetting<Types extends Record<string, SqLiteType> = Record<string, SqLiteType>> = {
    table?: string;
    types: Types;
    folder_name?: string;
    replace?: boolean;
};
type SqlReturnType<T> = T extends SqlProps<TEXT> ? string : T extends SqlProps<NONE> ? string | number | boolean : T extends SqlProps<NUMERIC> ? boolean | number | Date : number;
type SqlReturnValueType<Val, NN> = NN extends true ? SqlReturnType<Val> : Val extends `${infer _} NOT NULL` ? SqlReturnType<Val> : SqlReturnType<Val> | null;
type SqlReturnTypes<Obj extends object> = {
    [K in keyof Obj as Obj[K] extends AllSqlProps ? K : never]?: SqlReturnValueType<Obj[K], false>;
} & {
    [K in keyof Obj as Obj[K] extends `${AllSqlProps} NOT NULL` ? K : never]: SqlReturnValueType<Obj[K], false>;
} & {
    [K in keyof Obj as Obj[K] extends `${AllSqlProps} NOT NULL UNIQUE` ? K : never]: SqlReturnValueType<Obj[K], true>;
};
type LimitType = {
    max: number;
    offSet?: number;
};
type Operators = "=" | ">" | "<" | ">=" | "<=" | "<>";
type OrderBy<Value> = {
    or: `${keyof Value extends string ? keyof Value : never} ${Operators} ${(keyof Value extends string ? keyof Value : never) | number | true | false | `'${string}'`}`[];
    and: `${keyof Value extends string ? keyof Value : never} ${Operators} ${(keyof Value extends string ? keyof Value : never) | number | true | false | `'${string}'`}`[];
    in: {
        key: keyof Value;
        list: (string | number | boolean)[];
    }[];
};
type OptionType<Value> = {
    get?: "all" | (keyof Value)[];
    limit?: LimitType;
    orderBy?: Partial<OrderBy<Value>>;
};
export declare class Database<Value extends Record<string, SqLiteType>> {
    private table;
    private types;
    private folder_name;
    private replace;
    private db;
    constructor({ table, types, folder_name, replace, }: DatabaseSetting<Value>);
    set(value: SqlReturnTypes<Value>): this;
    private find;
    findAll(value: Partial<SqlReturnTypes<Value>>, options?: OptionType<Value>): [] | Partial<SqlReturnTypes<Value>>[];
    findOne(value: Partial<SqlReturnTypes<Value>>, options?: Omit<OptionType<Value>, "limit" | "get">): Partial<SqlReturnTypes<Value>> | undefined;
    update({ where, value, limit, }: {
        where: Partial<SqlReturnTypes<Value>>;
        value: Partial<SqlReturnTypes<Value>>;
        limit?: LimitType;
    }): this;
    delete({ where, limit, }: {
        where: Partial<SqlReturnTypes<Value>>;
        limit?: LimitType;
    }): this;
    deleteAll(): this;
    all(): SqlReturnTypes<Value>[] | undefined;
}
export {};
