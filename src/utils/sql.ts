import type { FilterOptions, LimitType } from "..";

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

export function AddText(value: object, types?: Record<string, string>) {
  return Object.entries(value as Record<string, string>)
    .sort()
    .reduce((pre, [key, value], curIndex, array) => {
      if (types && types[key].includes("PRIMARY KEY")) return pre;

      const comma = curIndex !== array.length - 1 ? ", " : "";

      if (value.trim() === "++" || value.trim() === "--") {
        let value_text = "";
        if (value.trim() === "++") {
          value_text = "+ 1";
        } else {
          value_text = "- 1";
        }

        pre += `${key} = IFNULL(${key}, 1) ${value_text} ${comma}`;
        return pre;
      }

      pre += `${key} = IFNULL(${key}, 1) ${value} ${comma}`;
      return pre;
    }, "");
}

export function FilterText(value: Partial<FilterOptions<any>>) {
  return Object.keys(value)
    .map((key) => {
      if (!value) return "";
      if (key === "or") {
        const vals = value[key];
        if (vals && vals.length > 0) {
          return vals.join(" OR ");
        }
        return "";
      }
      if (key === "and") {
        const vals = value[key];
        if (vals && vals.length > 0) {
          return vals.join(" AND ");
        }
        return "";
      }
      if (key === "in") {
        const vals = value[key];
        if (vals && vals.length > 0) {
          return vals
            .map((val) => {
              return `${val.key.toString()} IN (${val.list
                .map((item) => (typeof item === "string" ? `'${item}'` : item))
                .join(",")})`;
            })
            .join(" AND ");
        }
        return "";
      }
    })
    .join(" AND ");
}

export function WhereWithFilter(where_text: string, filter: string) {
  return `${where_text.length > 0 || filter.length > 0 ? "WHERE" : ""} ${
    where_text.length > 0 ? `${where_text}` : ""
  } ${
    filter.length > 0 ? (where_text.length > 0 ? `AND ${filter}` : filter) : ""
  }`;
}

export function LimitText(limit: LimitType) {
  return `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`;
}
