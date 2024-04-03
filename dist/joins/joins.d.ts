import Database, { Settings } from "..";
import type { ComparisonJoinType, JoinsTypes, OptionType, SqLiteType, SqlReturnTypes } from "../../types";
export declare class Joins<Value1 extends Record<string, SqLiteType>, Value2 extends Record<string, SqLiteType>> {
    join: JoinsTypes;
    tableL: Required<Database<Value1> | Settings<Value1>>;
    tableR: Required<Database<Value2> | Settings<Value2>>;
    private db;
    constructor(tableL: Required<Database<Value1> | Settings<Value1>>, tableR: Required<Database<Value2> | Settings<Value2>>, join?: JoinsTypes);
    find(options?: Omit<OptionType<Value1>, "filter"> & {
        filter?: ComparisonJoinType<Value1, Value2>;
    }): SqlReturnTypes<Value1>[] | undefined;
}
