import Database, { Settings } from "..";
import type {
  ComparisonJoinType,
  JoinsTypes,
  OptionJoinsType,
  SqLiteType,
  SqlReturnTypes,
} from "../../types";
import { CreateKey, GetText, LimitText, SagError, SagErrorMsg } from "../utils";
import sqlite3 from "better-sqlite3";

export class Joins<
  Value1 extends Record<string, SqLiteType>,
  Value2 extends Record<string, SqLiteType>
> {
  join: JoinsTypes;
  tableL: Required<Database<Value1> | Settings<Value1>>;
  tableR: Required<Database<Value2> | Settings<Value2>>;
  private db: sqlite3.Database;

  constructor(
    tableL: Required<Database<Value1> | Settings<Value1>>,
    tableR: Required<Database<Value2> | Settings<Value2>>,
    join?: JoinsTypes
  ) {
    this.tableL = tableL;
    this.tableR = tableR;

    if (this.tableL.folder_name !== this.tableR.folder_name)
      throw new SagError("Database", SagErrorMsg.NotSameFolder);

    if (this.tableL.table === this.tableR.table)
      throw new SagError("Database", SagErrorMsg.NotSameTableName);

    this.join = join ? join : "INNER JOIN";

    this.db = new sqlite3(`./${tableL.folder_name}.sqlite3`);

    this.db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.tableL.table} (${CreateKey(
        this.tableL.types
      )})`
    );

    this.db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.tableR.table} (${CreateKey(
        this.tableR.types
      )})`
    );
  }

  find(
    options?: Omit<OptionJoinsType<Value1>, "filter"> & {
      filter?: ComparisonJoinType<Value1, Value2>;
      where?: ComparisonJoinType<Value1, Value2>;
    }
  ) {
    const get =
      options && options.get
        ? options.get === "all"
          ? `*`
          : options.get === "left"
          ? `${this.tableL.table}.*`
          : options.get === "right"
          ? `${this.tableR.table}.*`
          : GetText(options.get)
        : "*";

    const limit_text = options && options.limit ? LimitText(options.limit) : "";

    return this.db
      .prepare(
        `SELECT ${get} FROM ${this.tableL.table} ${this.join} ${
          this.tableR.table
        } ${options?.filter ? `ON ${options.filter}` : ""} ${
          options?.where ? "WHERE " + options.where : ""
        } ${limit_text}`
      )
      .all() as SqlReturnTypes<Value1>[] | undefined;
  }
}
