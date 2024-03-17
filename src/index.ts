import sqlite3 from "better-sqlite3";

import { CreateKey, InsertText, UpdateText, WhereText } from "./utils";

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

type SqlReturnTypes<Obj> = {
  [Key in keyof Obj]: Obj[Key] extends `${infer _} PRIMARY KEY`
    ? null
    : Obj[Key] extends `${infer _} NOT NULL`
    ? SqlReturnType<Obj[Key]>
    : SqlReturnType<Obj[Key]> | null;
};

type LimitType = {
  max: number;
  offSet?: number;
};

type Operators = "=" | ">" | "<" | ">=" | "<=" | "<>";

type OrderBy<Value> = {
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

    this.db = new sqlite3(`./${this.folder_name}.sqlite3`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.table} (${keys})`);
  }

  set(value: SqlReturnTypes<Value>) {
    const { keys, values } = InsertText(value, this.types);
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
              }
              if (key === "and") {
                const vals = options.orderBy[key];
                if (vals && vals.length > 0) {
                  return vals.join(" AND ");
                }
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
    options?: Omit<OptionType<Value>, "limit">
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
    where: Partial<SqlReturnTypes<Value>>;
    value: Partial<SqlReturnTypes<Value>>;
    limit?: LimitType;
  }) {
    const where_text = WhereText(where, this.types);
    const values_text = UpdateText(value, this.types);
    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} WHERE ${where_text} ${
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
    where: Partial<SqlReturnTypes<Value>>;
    limit?: LimitType;
  }) {
    const where_text = WhereText(where, this.types);
    this.db.exec(
      `DELETE FROM ${this.table} WHERE ${where_text} ${
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
      | SqlReturnTypes<Value>[]
      | undefined;
  }
}
