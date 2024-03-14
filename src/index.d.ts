type INTAGER =
  | "INT"
  | "INTEGER"
  | "TINYINT"
  | "SMALLINT"
  | "MEDIUMINT"
  | "BIGINT"
  | "UNSIGNED BIG INT"
  | "INT2"
  | "INT8";
type TEXT =
  | "CHARACTER(20)"
  | "VARCHAR(255)"
  | "VARYING CHARACTER(255)"
  | "NCHAR(55)"
  | "NATIVE CHARACTER(70)"
  | "NVARCHAR(100)"
  | "TEXT"
  | "CLOB";

type NUMERIC = "NUMERIC" | `DECIMAL(10, 5)` | "BOOLEAN" | "DATE" | "DATETIME";

type REAL = "REAL" | "DOUBLE" | "DOUBLE PRECISION" | "FLOAT";

type NONE = "BLOB";

type SqlProps<T extends string> = `${T}${" NOT NULL" | ""}${" UNIQUE" | ""}${
  | " PRIMARY KEY"
  | ""}`;

export type SqLiteType =
  | SqlProps<INTAGER>
  | SqlProps<TEXT>
  | SqlProps<REAL>
  | SqlProps<NUMERIC>
  | SqlProps<NONE>;

export type DatabaseSetting<
  Types extends Record<string, SqLiteType> = Record<string, SqLiteType>
> = {
  table?: string;
  types: Types;
  folder_name?: string;
  replace?: boolean;
};

type SqlReturnType<T> = T extends SqlProps<TEXT>
  ? string
  : T extends SqlProps<NONE>
  ? string | number | boolean
  : T extends SqlProps<NUMERIC>
  ? boolean | number | Date
  : number;

export type SqlReturnTypes<Obj> = {
  [Key in keyof Obj]: Obj[Key] extends `${infer _} PRIMARY KEY`
    ? null
    : Obj[Key] extends `${infer _} NOT NULL`
    ? SqlReturnType<Obj[Key]>
    : SqlReturnType<Obj[Key]> | null;
};

export type LimitType = {
  max: number;
  offSet?: number;
};

type Operators = "=" | ">" | "<" | ">=" | "<=" | "<>";

export type OrderBy<Value> = {
  or: `${keyof Value extends string ? keyof Value : never} ${Operators} ${
    | (keyof Value extends string ? keyof Value : never)
    | number
    | true
    | false
    | `'${string}'`}`[];
  and: `${keyof Value extends string ? keyof Value : never} ${Operators} ${
    | (keyof Value extends string ? keyof Value : never)
    | number
    | true
    | false
    | `'${string}'`}`[];
  in: { key: keyof Value; list: (string | number | boolean)[] }[];
};

export type OptionType<Value> = {
  get?: "all" | (keyof Value)[];
  limit?: LimitType;
  orderBy?: Partial<OrderBy<Value>>;
};

export interface Events<Value> {
  set: [val: Value | undefined];
  delete: [];
  update: [val: Value | undefined];
}
