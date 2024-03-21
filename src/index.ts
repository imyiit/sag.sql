import sqlite3 from "better-sqlite3";

import {
  CreateKey,
  InsertText,
  UpdateText,
  WhereText,
  SagError,
  SagErrorMsg,
  AddText,
} from "./utils";

type INTAGER =
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

type AllNumericProps = INTAGER | NUMERIC | REAL;
type AllSqlProps = TEXT | AllNumericProps | NONE;
type SqlProps<T extends string> = `${T}${" NOT NULL" | ""}${" UNIQUE" | ""}${
  | " PRIMARY KEY"
  | ""}`;

export type SqLiteType = SqlProps<AllSqlProps>;

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

type SqlReturnValueType<Val, NN> = NN extends true
  ? SqlReturnType<Val>
  : Val extends `${infer _} NOT NULL`
  ? SqlReturnType<Val>
  : SqlReturnType<Val> | null;

type SqlReturnTypes<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends AllSqlProps
    ? K
    : never]?: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps} UNIQUE`
    ? K
    : never]?: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps} NOT NULL`
    ? K
    : never]: SqlReturnValueType<Obj[K], false>;
} & {
  [K in keyof Obj as Obj[K] extends `${AllSqlProps} NOT NULL UNIQUE`
    ? K
    : never]: SqlReturnValueType<Obj[K], true>;
};

type ArithmeticOperators = "+" | "-" | "/" | "*";

type SqlAddReturnTypes<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends AllNumericProps ? K : never]?:
    | `${ArithmeticOperators} ${(K extends string ? K : never) | number}`
    | "++"
    | "--";
} & {
  [K in keyof Obj as Obj[K] extends `${AllNumericProps} NOT NULL` ? K : never]:
    | `${ArithmeticOperators} ${(K extends string ? K : never) | number}`
    | "++"
    | "--";
} & {
  [K in keyof Obj as Obj[K] extends `${AllNumericProps} NOT NULL UNIQUE`
    ? K
    : never]:
    | `${ArithmeticOperators} ${
        | (K extends AllNumericProps ? K : never)
        | number}`
    | "++"
    | "--";
};

type LimitType = {
  max: number;
  offSet?: number;
};

type ComparisonOperators = "=" | ">" | "<" | ">=" | "<=" | "<>";

type OrderBy<Value> = {
  or: `${keyof Value extends string
    ? keyof Value
    : never} ${ComparisonOperators} ${
    | (keyof Value extends string ? keyof Value : never)
    | number
    | true
    | false
    | `'${string}'`}`[];
  and: `${keyof Value extends string
    ? keyof Value
    : never} ${ComparisonOperators} ${
    | (keyof Value extends string ? keyof Value : never)
    | number
    | true
    | false
    | `'${string}'`}`[];
  in: { key: keyof Value; list: (string | number | boolean)[] }[];
};

type OptionType<Value> = {
  get?: "all" | (keyof Value)[];
  limit?: LimitType;
  orderBy?: Partial<OrderBy<Value>>;
};

export class Database<Value extends Record<string, SqLiteType>> {
  private table: string;
  private types: Value;
  private folder_name: string;
  private replace: boolean;
  private db: sqlite3.Database;

  constructor({
    table = "local",
    types,
    folder_name = "sqlite",
    replace = false,
  }: DatabaseSetting<Value>) {
    this.table = table;
    this.types = types;
    this.folder_name = folder_name;
    this.replace = replace;

    const keys = CreateKey(this.types);

    if (keys.length === 0)
      throw new SagError("Database", SagErrorMsg.TypesZero);

    this.db = new sqlite3(`./${this.folder_name}.sqlite3`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.table} (${keys})`);
  }

  set(value: SqlReturnTypes<Value>) {
    const { keys, values } = InsertText(value, this.types);
    if (!keys || !values) return this;
    this.db.exec(
      `INSERT OR ${this.replace ? "REPLACE" : "IGNORE"} INTO ${
        this.table
      } (${keys}) VALUES (${values})`
    );
    return this;
  }

  private find(
    value: Partial<SqlReturnTypes<Value>>,
    options?: OptionType<Value>
  ) {
    const where_text = WhereText(value, this.types);

    const get =
      options && options.get
        ? options.get === "all"
          ? "*"
          : options.get
              .map((_val) => _val.toString().toLowerCase())
              .filter((value, index, array) => array.indexOf(value) === index)
              .sort()
              .reduce((pre, cur, curIndex, array) => {
                const comma = curIndex !== array.length - 1 ? ", " : "";
                pre += `${cur}${comma}`;
                return pre;
              }, "")
        : "*";

    const orderBy =
      options && options.orderBy
        ? Object.keys(options.orderBy)
            .map((key) => {
              if (!options.orderBy) return "";
              if (key === "or") {
                const vals = options.orderBy[key];
                if (vals && vals.length > 0) {
                  return vals.join(" OR ");
                }
                return "";
              }
              if (key === "and") {
                const vals = options.orderBy[key];
                if (vals && vals.length > 0) {
                  return vals.join(" AND ");
                }
                return "";
              }
              if (key === "in") {
                const vals = options.orderBy[key];
                if (vals && vals.length > 0) {
                  return vals
                    .map((val) => {
                      return `${val.key.toString()} IN (${val.list
                        .map((item) =>
                          typeof item === "string" ? `'${item}'` : item
                        )
                        .join(",")})`;
                    })
                    .join(" AND ");
                }
                return "";
              }
            })
            .join(" AND ")
        : "";

    return this.db.prepare(
      `SELECT ${get} FROM ${this.table} ${
        where_text.length > 0 || orderBy.length > 0 ? "WHERE" : ""
      } ${where_text.length > 0 ? `${where_text}` : ""} ${
        orderBy.length > 0
          ? where_text.length > 0
            ? `AND ${orderBy}`
            : orderBy
          : ""
      } ${
        options && options.limit
          ? `LIMIT ${options.limit.max} ${
              options.limit.offSet ? `OFFSET ${options.limit.offSet}` : ""
            }`
          : ""
      }`
    );
  }

  findAll(value: Partial<SqlReturnTypes<Value>>, options?: OptionType<Value>) {
    return this.find(value, options).all() as
      | Partial<SqlReturnTypes<Value>>[]
      | [];
  }

  findOne(
    value: Partial<SqlReturnTypes<Value>>,
    options?: Omit<OptionType<Value>, "limit" | "get">
  ) {
    return this.find(value, options).get() as
      | Partial<SqlReturnTypes<Value>>
      | undefined;
  }

  update({
    where,
    value,
    limit,
  }: {
    where?: Partial<SqlReturnTypes<Value>>;
    value?: Partial<SqlReturnTypes<Value>>;
    limit?: LimitType;
  }) {
    const values_text = UpdateText(value || {}, this.types);

    if (!values_text || values_text.length === 0) {
      throw new SagError("Update", SagErrorMsg.ValueZero);
    }

    const where_text = WhereText(where || {}, this.types);
    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${
        where_text.length > 0 ? `WHERE ${where_text}` : ""
      } ${
        limit
          ? `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`
          : ""
      }`
    );
    return this;
  }

  add({
    value,
    where,
    limit,
  }: {
    where?: Partial<SqlReturnTypes<Value>>;
    value?: Partial<SqlAddReturnTypes<Value>>;
    limit?: LimitType;
  }) {
    const values_text = AddText(value || {}, this.types);

    if (!values_text || values_text.length === 0) {
      throw new SagError("Add", SagErrorMsg.ValueZero);
    }

    const where_text = WhereText(where || {}, this.types);
    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${
        where_text.length > 0 ? `WHERE ${where_text}` : ""
      } ${
        limit
          ? `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`
          : ""
      }`
    );
    return this;
  }

  delete({
    where,
    limit,
  }: {
    where?: Partial<SqlReturnTypes<Value>>;
    limit?: LimitType;
  }) {
    const where_text = WhereText(where || {}, this.types);
    this.db.exec(
      `DELETE FROM ${this.table} ${
        where_text.length > 0 ? `WHERE ${where_text}` : ""
      } ${
        limit
          ? `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`
          : ""
      }`
    );
    return this;
  }

  deleteAll() {
    this.db.exec(`DELETE FROM ${this.table}`);
    return this;
  }

  all() {
    return this.db.prepare(`SELECT * FROM ${this.table}`).all() as
      | SqlReturnTypes<Value>[];
  }
}
