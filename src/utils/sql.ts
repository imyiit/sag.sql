export function CreateKey(values: object) {
  return Object.entries(values)
    .sort()
    .reduce((pre, [key, type], curIndex, array) => {
      const comma = curIndex !== array.length - 1 ? ", " : "";

      pre += `${key} ${type}${comma}`;
      return pre;
    }, "");
}

export function InsertText(values: Object, types?: Record<string, string>) {
  return Object.entries(values)
    .sort()
    .reduce(
      (pre, [key, type], curIndex, array) => {
        if (types && types[key].includes("PRIMARY KEY")) return pre;
        const comma = curIndex !== array.length - 1 ? ", " : "";
        pre.keys += `${key}${comma}`;
        pre.values += `${
          typeof type === "string"
            ? `'${type}'`
            : typeof type === "undefined"
            ? null
            : type
        }${comma}`;
        return pre;
      },
      { keys: "", values: "" }
    );
}

export function WhereText(value: Object, types: Record<string, string>) {
  return Object.entries(value)
    .sort()
    .reduce((pre, [key, value], curIndex, array) => {
      if (types[key].includes("PRIMARY KEY")) return pre;

      const and = curIndex !== array.length - 1 ? " AND " : "";
      pre += `${key} ${
        typeof value === "string"
          ? `= '${value}'`
          : !value
          ? "is null"
          : `= ${value}`
      }${and}`;
      return pre;
    }, "");
}

export function UpdateText(value: object, types?: Record<string, string>) {
  return Object.entries(value)
    .sort()
    .reduce((pre, [key, value], curIndex, array) => {
      if (types && types[key].includes("PRIMARY KEY")) return pre;

      const comma = curIndex !== array.length - 1 ? ", " : "";
      pre += `${key} ${
        typeof value === "string"
          ? `= '${value}'`
          : !value
          ? "is null"
          : `= ${value}`
      }${comma}`;
      return pre;
    }, "");
}
