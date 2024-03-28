import type {
  SqLiteType,
  DatabaseSetting,
  SqlReturnTypes,
  OptionType,
  SqlNumericReturnTypes,
} from "../../types";

import sqlite3 from "better-sqlite3";

import {
  CreateKey,
  InsertText,
  UpdateText,
  WhereText,
  SagError,
  SagErrorMsg,
  AddText,
  FilterText,
  WhereWithFilter,
  LimitText,
} from "../utils";

export class Database<Value extends Record<string, SqLiteType>> {
  private table: string;
  types: Value;
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

    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    return this.db.prepare(
      `SELECT ${get} FROM ${this.table} ${WhereWithFilter(
        where_text,
        filter
      )} ${limit_text}`
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

  update(
    {
      where,
      value,
    }: {
      where?: Partial<SqlReturnTypes<Value>>;
      value?: Partial<SqlReturnTypes<Value>>;
    },
    options?: Omit<OptionType<Value>, "get">
  ) {
    const values_text = UpdateText(value || {}, this.types);

    if (!values_text || values_text.length === 0) {
      throw new SagError("Update", SagErrorMsg.ValueZero);
    }
    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const where_text = WhereText(where || {}, this.types);
    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${WhereWithFilter(
        where_text,
        filter
      )} ${limit_text}`
    );
    return this;
  }

  add(
    {
      value,
      where,
    }: {
      where?: Partial<SqlReturnTypes<Value>>;
      value?: Partial<SqlNumericReturnTypes<Value>>;
    },
    options?: Omit<OptionType<Value>, "get">
  ) {
    const values_text = AddText(value || {}, this.types);

    if (!values_text || values_text.length === 0) {
      throw new SagError("Add", SagErrorMsg.ValueZero);
    }

    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const where_text = WhereText(where || {}, this.types);
    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${WhereWithFilter(
        where_text,
        filter
      )} ${limit_text}`
    );
    return this;
  }

  delete(
    where?: Partial<SqlReturnTypes<Value>>,
    options?: Omit<OptionType<Value>, "get">
  ) {
    const where_text = WhereText(where || {}, this.types);
    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `DELETE FROM ${this.table} ${WhereWithFilter(
        where_text,
        filter
      )} ${limit_text}`
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
