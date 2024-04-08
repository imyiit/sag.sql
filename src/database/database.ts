import type {
  SqLiteType,
  DatabaseSetting,
  SqlValueTypes,
  OptionType,
  SqlNumericReturnTypes,
  SqlReturnTypes,
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
  GetText,
} from "../utils";

export class Database<Value extends Record<string, SqLiteType>> {
  table: string;
  types: Value;
  folder_name: string;
  replace: boolean;
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

  set(value: SqlValueTypes<Value>) {
    const { keys, values } = InsertText(value);
    if (!keys || !values) return this;
    this.db.exec(
      `INSERT OR ${this.replace ? "REPLACE" : "IGNORE"} INTO ${
        this.table
      } (${keys}) VALUES (${values})`
    );
    return this;
  }

  private find(
    value: Partial<SqlValueTypes<Value>>,
    options?: OptionType<Value>
  ) {
    const where_text = WhereText(value);

    const get =
      options && options.get
        ? options.get === "all" || options.get.length === 0
          ? "*"
          : GetText(options.get)
        : "*";

    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";

    const orderBy =
      options && options.orderBy
        ? `ORDER BY ${options.orderBy.join(", ")}`
        : "";

    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    return this.db.prepare(
      `SELECT ${get} FROM ${this.table} ${WhereWithFilter(
        where_text,
        filter
      )} ${orderBy} ${limit_text}`
    );
  }

  findAll(value: Partial<SqlValueTypes<Value>>, options?: OptionType<Value>) {
    return this.find(value, options).all() as SqlReturnTypes<Value>[] | [];
  }

  findOne(
    value: Partial<SqlValueTypes<Value>>,
    options?: Omit<OptionType<Value>, "limit">
  ) {
    return this.find(value, options).get() as SqlReturnTypes<Value> | undefined;
  }

  update(
    {
      where,
      value,
    }: {
      where?: Partial<SqlValueTypes<Value>>;
      value?: Partial<SqlValueTypes<Value>>;
    },
    options?: Omit<OptionType<Value>, "get">
  ) {
    const values_text = UpdateText(value || {});

    if (!values_text || values_text.length === 0) {
      throw new SagError("Update", SagErrorMsg.ValueZero);
    }
    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const where_text = WhereText(where || {});

    const orderBy =
      options && options.orderBy
        ? `ORDER BY ${options.orderBy.join(", ")}`
        : "";

    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${WhereWithFilter(
        where_text,
        filter
      )} ${orderBy} ${limit_text}`
    );
    return this;
  }

  add(
    {
      value,
      where,
    }: {
      where?: Partial<SqlValueTypes<Value>>;
      value?: Partial<SqlNumericReturnTypes<Value>>;
    },
    options?: Omit<OptionType<Value>, "get">
  ) {
    const values_text = AddText(value || {});

    if (!values_text || values_text.length === 0) {
      throw new SagError("Add", SagErrorMsg.ValueZero);
    }

    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";
    const where_text = WhereText(where || {});
    const orderBy =
      options && options.orderBy
        ? `ORDER BY ${options.orderBy.join(", ")}`
        : "";
    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `UPDATE ${this.table} SET ${values_text} ${WhereWithFilter(
        where_text,
        filter
      )} ${orderBy} ${limit_text}`
    );
    return this;
  }

  delete(
    where?: Partial<SqlValueTypes<Value>>,
    options?: Omit<OptionType<Value>, "get">
  ) {
    const where_text = WhereText(where || {});
    const filter =
      options && options.filter
        ? typeof options.filter === "string"
          ? options.filter
          : FilterText(options.filter)
        : "";

    const orderBy =
      options && options.orderBy
        ? `ORDER BY ${options.orderBy.join(", ")}`
        : "";

    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    this.db.exec(
      `DELETE FROM ${this.table} ${WhereWithFilter(
        where_text,
        filter
      )} ${orderBy} ${limit_text}`
    );
    return this;
  }

  deleteAll() {
    this.db.exec(`DELETE FROM ${this.table}`);
    return this;
  }

  all() {
    return this.db.prepare(`SELECT * FROM ${this.table}`).all() as
      | SqlValueTypes<Value>[];
  }
}
