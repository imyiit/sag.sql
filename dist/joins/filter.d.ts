import { Joins } from "..";
import { ComparisonJoinType, ComparisonOperators, SqLiteType } from "../../types";
export declare class JoinsFilter<Value1 extends Record<string, SqLiteType>, Value2 extends Record<string, SqLiteType>> {
    joins: Joins<Value1, Value2>;
    private buildTextArray;
    constructor(joins: Joins<Value1, Value2>);
    private and_or_maker;
    and(...values: `${keyof Value1 extends string ? keyof Value1 : never} ${ComparisonOperators} ${keyof Value2 extends string ? keyof Value2 : never}`[]): this;
    or(...values: `${keyof Value1 extends string ? keyof Value1 : never} ${ComparisonOperators} ${keyof Value2 extends string ? keyof Value2 : never}`[]): this;
    private text;
    build(): ComparisonJoinType<Value1, Value2>;
}
