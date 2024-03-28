import type { SqLiteType, ComparisonType, SqlKeywords } from "../../types";
import type { Database } from "../database";
import type { Settings } from "../settings";
export declare class Filter<Value extends Record<string, SqLiteType>> {
    types: Value;
    keys: (keyof Value)[];
    keywords: Record<number, {
        value: string;
        keyword: SqlKeywords;
    }[]>;
    private id;
    constructor(settings: Settings<Value> | Database<Value>);
    private keywordBuilder;
    or(values: ComparisonType<Value>[]): this;
    and(values: ComparisonType<Value>[]): this;
    between(...values: Partial<Record<keyof Value, [number, number]>>[]): this;
    in(...values: Partial<Record<keyof Value, (string | boolean | number)[]>>[]): this;
    build(): string;
}
