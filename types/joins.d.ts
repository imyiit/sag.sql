import {
  ComparisonOperators,
  ComparisonType,
  LimitType,
  NumericFilter,
} from ".";

export type JoinsTypes =
  | "INNER JOIN"
  | "LEFT JOIN"
  | "RIGHT JOIN"
  | "FULL JOIN";

export type ComparisonJoinType<Value1, Value2> = `${keyof Value1 extends string
  ? keyof Value1
  : never} ${ComparisonOperators} ${
  | (keyof Value2 extends string ? keyof Value2 : never)
  | number
  | true
  | false
  | `'${string}'`}`;

export type OptionJoinsType<Value> = {
  get?: "all" | (keyof Value)[] | "right" | "left";
  limit?: LimitType;
  filter?: Partial<NumericFilter<Value>> | ComparisonType<Value>;
  orderBy?: `${keyof Value extends string ? keyof Value : never}${
    | ""
    | " ASC"
    | " DESC"}`[];
};
