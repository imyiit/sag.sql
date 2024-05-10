import { Joins } from "..";
import {
  ComparisonJoinType,
  ComparisonOperators,
  SqLiteType,
} from "../../types";

export class JoinsFilter<
  Value1 extends Record<string, SqLiteType>,
  Value2 extends Record<string, SqLiteType>
> {
  joins: Joins<Value1, Value2>;
  private buildTextArray: string[] = [];

  constructor(joins: Joins<Value1, Value2>) {
    this.joins = joins;
  }

  and(
    ...values: `${keyof Value1 extends string
      ? keyof Value1 | `'${string}'` | number
      : never} ${ComparisonOperators} ${keyof Value2 extends string
      ? keyof Value2 | `'${string}'` | number
      : never}`[]
  ) {
    if (!values || values.length === 0) return this;
    const converted = values.map((val) =>
      !val.length
        ? ("" as ComparisonJoinType<Value1, Value2>)
        : (() => {
            const vals = val.split(" ");
            return this.text(vals[0], vals[1] as ComparisonOperators, vals[2]);
          })()
    );
    this.and_or_maker(converted, "AND");
    return this;
  }

  or(
    ...values: `${keyof Value1 extends string | number
      ? keyof Value1 | `'${string}'` | number
      : never} ${ComparisonOperators} ${keyof Value2 extends string
      ? keyof Value2 | `'${string}'` | number
      : never}`[]
  ) {
    if (!values || values.length === 0) return this;
    const converted = values.map((val) =>
      !val.length
        ? ("" as ComparisonJoinType<Value1, Value2>)
        : (() => {
            const vals = val.split(" ");
            return this.text(vals[0], vals[1] as ComparisonOperators, vals[2]);
          })()
    );
    this.and_or_maker(converted, "OR");
    return this;
  }

  private text(
    value1: keyof Value1,
    expression: ComparisonOperators,
    value2: keyof Value2
  ) {
    const tableLValue = Object.keys(this.joins.tableL.types).includes(
      String(value1)
    )
      ? `${this.joins.tableL.table}.${String(value1)}`
      : String(value1);

    const tableRValue = Object.keys(this.joins.tableR.types).includes(
      String(value2)
    )
      ? `${this.joins.tableR.table}.${String(value2)}`
      : String(value2);

    return `${tableLValue}${expression}${tableRValue}` as ComparisonJoinType<
      Value1,
      Value2
    >;
  }

  private and_or_maker(
    values: ComparisonJoinType<Value1, Value2>[],
    type: "OR" | "AND"
  ) {
    if (values.length === 1) {
      this.buildTextArray.push(`${values[0]}`);
      return this;
    }
    this.buildTextArray.push(`${values.join(` ${type} `)}`);
    return this;
  }
  build() {
    const text = `${this.buildTextArray
      .map((txt) => `(${txt})`)
      .join(" AND ")}`;
    this.buildTextArray = [];
    return (!text.length ? "" : `${text}`) as ComparisonJoinType<
      Value1,
      Value2
    >;
  }
}
