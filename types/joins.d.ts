import { ComparisonOperators } from ".";

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
