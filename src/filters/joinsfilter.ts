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

  and(
    ...values: [
      value1: keyof Value1,
      expression: ComparisonOperators,
      value2: keyof Value2
    ][]
  ) {
    if (!values || values.length === 0) return this;
    const converted = values.map((vals) =>
      vals.length < 3
        ? ("" as ComparisonJoinType<Value1, Value2>)
        : this.text(vals[0], vals[1], vals[2])
    );
    this.and_or_maker(converted, "AND");
    return this;
  }

  or(
    ...values: [
      value1: keyof Value1,
      expression: ComparisonOperators,
      value2: keyof Value2
    ][]
  ) {
    if (!values || values.length === 0) return this;
    const converted = values.map((vals) =>
      vals.length < 3
        ? ("" as ComparisonJoinType<Value1, Value2>)
        : this.text(vals[0], vals[1], vals[2])
    );
    this.and_or_maker(converted, "OR");
    return this;
  }

  private text(
    value1: keyof Value1,
    expression: ComparisonOperators,
    value2: keyof Value2
  ) {
    return `${this.joins.tableL.table}.${String(value1)}${expression}${
      this.joins.tableR.table
    }.${String(value2)}` as ComparisonJoinType<Value1, Value2>;
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
