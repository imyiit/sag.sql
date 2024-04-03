export type INTAGER =
  | "INTEGER"
  | "TINYINT"
  | "SMALLINT"
  | "MEDIUMINT"
  | "BIGINT"
  | "UNSIGNED BIG INT"
  | "INT2"
  | "INT8";
export type TEXT =
  | "CHARACTER(20)"
  | "VARCHAR(255)"
  | "VARYING CHARACTER(255)"
  | "NCHAR(55)"
  | "NATIVE CHARACTER(70)"
  | "NVARCHAR(100)"
  | "TEXT"
  | "CLOB";

export type NUMERIC =
  | "NUMERIC"
  | `DECIMAL(10, 5)`
  | "BOOLEAN"
  | "DATE"
  | "DATETIME";

export type REAL = "REAL" | "DOUBLE" | "DOUBLE PRECISION" | "FLOAT";

export type NONE = "BLOB";

export type ArithmeticOperators = "+" | "-" | "/" | "*";
export type ComparisonOperators = "=" | ">" | "<" | ">=" | "<=" | "<>";

export type AllNumericProps = INTAGER | NUMERIC | REAL;
export type AllSqlProps = TEXT | AllNumericProps | NONE;

export type SqlProps<T extends string> = `${T}${" NOT NULL" | ""}${
  | " UNIQUE"
  | " PRIMARY KEY"
  | ""}${"" | " AUTOINCREMENT"}`;

export type SqltoJs<T> = T extends SqlProps<TEXT>
  ? string
  : T extends SqlProps<NONE>
  ? string | number | boolean
  : T extends SqlProps<NUMERIC>
  ? boolean | number | Date
  : number;

export type SqlReturnValueType<Val, NN> = NN extends true
  ? SqltoJs<Val>
  : Val extends `${infer _} ${
      | "NOT NULL"
      | "PRIMARY KEY"
      | `NOT NULL${infer _}PRIMARY KEY`}${infer _}`
  ? SqltoJs<Val>
  : SqltoJs<Val> | null;

export type SqlValueTypes<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps}${infer _}`
    ? K
    : never]?: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps} ${
    | "NOT NULL"
    | "PRIMARY KEY"
    | `NOT NULL${infer _}PRIMARY KEY`}`
    ? K
    : never]: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps}${infer _}AUTOINCREMENT`
    ? K
    : never]?: SqlReturnValueType<Obj[K], false>;
};

export type SqlReturnTypes<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps}${infer _}`
    ? K
    : never]?: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps} ${
    | "NOT NULL"
    | "PRIMARY KEY"
    | `NOT NULL${infer _}PRIMARY KEY`}${infer _}`
    ? K
    : never]: SqlReturnValueType<Obj[K], false>;
};

export type SqLiteType = SqlProps<AllSqlProps>;

export * from "./database";
export * from "./option";
export * from "./joins"
