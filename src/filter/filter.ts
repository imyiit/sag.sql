import Database, { Settings } from "..";
import { ComparisonType, SqLiteType } from "../../types";

export class Filter<Value extends Record<string, SqLiteType>> {
  types: Value;

  private buildTextArray: string[] = [];

  constructor(setting: Settings<Value> | Database<Value>) {
    this.types = setting.types;
  }

  private and_or_maker(values: ComparisonType<Value>[], type: "OR" | "AND") {
    if (values.length === 1) {
      this.buildTextArray.push(`${values[0]}`);
      return this;
    }
    this.buildTextArray.push(`${values.join(` ${type} `)}`);
    return this;
  }

  and(values?: ComparisonType<Value>[]) {
    if (!values || values.length === 0) return this;
    this.and_or_maker(values, "AND");
    return this;
  }
  or(values?: ComparisonType<Value>[]) {
    if (!values || values.length === 0) return this;
    this.and_or_maker(values, "OR");
    return this;
  }
  between(values?: Partial<Record<keyof Value, [number, number]>>[]) {
    if (!values || !Array.isArray(values) || values.length === 0) return this;

    let betweenTexts: string[] = [];

    values.forEach((val) => {
      Object.keys(val).forEach((k) => {
        //@ts-ignore
        betweenTexts.push(`${k} BETWEEN ${val[k][0]} AND ${val[k][1]}`);
      });
    });

    if (betweenTexts.length === 0) return this;

    this.buildTextArray.push(`${betweenTexts.join(" AND ")}`);

    return this;
  }

  in(values: Partial<Record<keyof Value, (string | boolean | number)[]>>[]) {
    if (!values || !Array.isArray(values) || values.length === 0) return this;

    let betweenTexts: string[] = [];

    values.forEach((val) => {
      Object.keys(val).forEach((k) => {
        //@ts-ignore
        betweenTexts.push(
          `${k} IN (${val[k]
            ?.map((v) =>
              typeof v === "string"
                ? `'${v}'`
                : typeof v === "boolean"
                ? v === false
                  ? 0
                  : 1
                : v
            )
            .join(",")})`
        );
      });
    });

    if (betweenTexts.length === 0) return this;

    this.buildTextArray.push(`${betweenTexts.join(" AND ")}`);

    return this;
  }

  get build() {
    const text = `${this.buildTextArray.join(") AND (")}`;
    this.buildTextArray = [];
    return !text.length ? "" : `(${text})`;
  }
}
