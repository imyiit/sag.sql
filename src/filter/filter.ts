import type { SqLiteType, ComparisonType, SqlKeywords } from "../../types";
import type { Database } from "../database";
import type { Settings } from "../settings";

export class Filter<Value extends Record<string, SqLiteType>> {
  types: Value;
  keys: (keyof Value)[];
  keywords: Record<number, { value: string; keyword: SqlKeywords }[]>;
  private id: number;
  constructor(settings: Settings<Value> | Database<Value>) {
    this.types = settings.types;
    this.keys = Object.keys(this.types);
    this.keywords = {};
    this.id = 0;
  }

  private keywordBuilder(
    values: ComparisonType<Value>[],
    keyword: SqlKeywords
  ) {
    values.forEach((value) => {
      if (!Array.isArray(this.keywords[this.id])) {
        this.keywords[this.id] = [];
      }
      this.keywords[this.id].push({ value, keyword });
    });
    this.id++;
  }

  or(values: ComparisonType<Value>[]) {
    this.keywordBuilder(values, "OR");
    return this;
  }

  and(values: ComparisonType<Value>[]) {
    this.keywordBuilder(values, "AND");
    return this;
  }

  between(...values: Partial<Record<keyof Value, [number, number]>>[]) {
    if (!Array.isArray(values)) return this;
    if (values.length === 0) return this;
    values.forEach((value) => {
      const key = Object.keys(value)[0];
      if (!key) return this;
      if (!Array.isArray(this.keywords[this.id])) {
        this.keywords[this.id] = [];
      }
      this.keywords[this.id].push({
        value: `${key} BETWEEN ${value[key]?.[0]} AND ${value[key]?.[1]}`,
        keyword: "AND",
      });
    });
    this.id++;
    return this;
  }

  in(...values: Partial<Record<keyof Value, (string | boolean | number)[]>>[]) {
    if (!Array.isArray(values)) return this;
    if (values.length === 0) return this;
    values.forEach((value) => {
      const key = Object.keys(value)[0];
      if (!key) return this;
      if (!Array.isArray(this.keywords[this.id])) {
        this.keywords[this.id] = [];
      }
      this.keywords[this.id].push({
        value: `${key} IN (${value[key]?.map((val) =>
          typeof val === "string"
            ? `'${val}'`
            : typeof val === "boolean"
            ? val === false
              ? 0
              : 1
            : val
        )})`,
        keyword: "AND",
      });
    });
    this.id++;
    return this;
  }

  build() {
    this.id = 0;
    const copyKw = { ...this.keywords };
    this.keywords = {};
    return Object.keys(copyKw)
      .map((_, i) => {
        const values = copyKw[i];
        return `(${values
          .map((v, _, array) => (array.length === 1 ? v.value : `(${v.value})`))
          .join(` ${values[0].keyword} `)})`;
      })
      .join(" AND ");
  }
}
