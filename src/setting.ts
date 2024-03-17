import type { SqLiteType, DatabaseSetting } from ".";

export class Setting<Value extends Record<string, SqLiteType>> {
  table: string;
  types: Value;
  folder_name: string;
  replace: boolean;
  constructor({
    table = "local",
    types,
    folder_name = "sqlite",
    replace = false,
  }: DatabaseSetting<Value>) {
    this.table = table;
    this.types = types;
    this.folder_name = folder_name;
    this.replace = replace;
  }
}
