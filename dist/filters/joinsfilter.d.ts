import { Joins } from "..";
import { ComparisonJoinType, ComparisonOperators, SqLiteType } from "../../types";
export declare class JoinsFilter<Value1 extends Record<string, SqLiteType>, Value2 extends Record<string, SqLiteType>> {
    joins: Joins<Value1, Value2>;
    private buildTextArray;
    constructor(joins: Joins<Value1, Value2>);
    private and_or_maker;
    and(values: [
        value1: keyof Value1,
        expression: ComparisonOperators,
        value2: keyof Value2
    ][]): this;
    or(values: [
        value1: keyof Value1,
        expression: ComparisonOperators,
        value2: keyof Value2
    ][]): this;
    private text;
    build(): ComparisonJoinType<Value1, Value2>;
}
