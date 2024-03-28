import { AllNumericProps } from ".";
export type ArithmeticOperators = "+" | "-" | "/" | "*";
export type ComparisonOperators = "=" | ">" | "<" | ">=" | "<=" | "<>";
export type SqlKeywords = "AND" | "OR";

export type SqlKeywordsArray = {
  keyword: SqlKeywords;
  value: string;
  id: number;
}[];

export type LimitType = {
  max: number;
  offSet?: number;
};

export type ComparisonType<Value> = `${keyof Value extends string
  ? keyof Value
  : never} ${ComparisonOperators} ${
  | (keyof Value extends string ? keyof Value : never)
  | number
  | true
  | false
  | `'${string}'`}`;

export type NumericFilter<Value> = {
  or: ComparisonType<Value>[];
  and: ComparisonType<Value>[];
  in: { key: keyof Value; list: (string | number | boolean)[] }[];
};

export type OptionType<Value> = {
  get?: "all" | (keyof Value)[];
  limit?: LimitType;
  filter?: Partial<NumericFilter<Value>> | string;
};

export type SqlNumericReturnTypes<Obj extends object> = {
  [K in keyof Obj as Obj[K] extends AllNumericProps ? K : never]?:
    | `${ArithmeticOperators} ${(K extends string ? K : never) | number}`
    | "++"
    | "--";
} & {
  [K in keyof Obj as Obj[K] extends `${AllNumericProps} UNIQUE` ? K : never]?:
    | `${ArithmeticOperators} ${(K extends string ? K : never) | number}`
    | "++"
    | "--";
} & {
  [K in keyof Obj as Obj[K] extends `${AllNumericProps} NOT NULL` ? K : never]:
    | `${ArithmeticOperators} ${(K extends string ? K : never) | number}`
    | "++"
    | "--";
} & {
  [K in keyof Obj as Obj[K] extends `${AllNumericProps} NOT NULL UNIQUE`
    ? K
    : never]:
    | `${ArithmeticOperators} ${
        | (K extends AllNumericProps ? K : never)
        | number}`
    | "++"
    | "--";
};
