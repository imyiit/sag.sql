export enum SagErrorMsg {
  TypesZero = "Database argument of 'types' need min one argument.",
  ValueZero = "Value need min one argument.",
}

type ErrorTypes = "Update" | "Set" | "Delete" | "Find" | "Database" | "Add";

export class SagError extends Error {
  constructor(type: ErrorTypes, text: string) {
    super(`${type} Error - ${text}`);
  }
}
