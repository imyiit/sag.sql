import { SqLiteType } from ".";

export type DatabaseSetting<
  Types extends Record<string, SqLiteType> = Record<string, SqLiteType>
> = {
  table?: string;
  types: Types;
  folder_name?: string;
  replace?: boolean;
};
