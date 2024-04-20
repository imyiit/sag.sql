import Database, { Settings } from "..";
import { ComparisonType, SqLiteType } from "../../types";
export declare class DatabaseFilter<Value extends Record<string, SqLiteType>> {
    types: Value;
    private buildTextArray;
    constructor(setting: Settings<Value> | Database<Value>);
    private and_or_maker;
    and(...values: ComparisonType<Value>[]): this;
    or(...values: ComparisonType<Value>[]): this;
    between(...values: Partial<Record<keyof Value, [number, number]>>[]): this;
    in(...values: Partial<Record<keyof Value, (string | boolean | number)[]>>[]): this;
    build(): ComparisonType<Value>;
}
