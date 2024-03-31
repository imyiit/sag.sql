import type { NumericFilter, LimitType } from "../../types";

export function CreateKey(values: Object) {
  return Object.entries(values)
    .sort()
    .map(([key, type]) => {
      return `${key} ${type}`;
    })
    .join(", ");
}

export function InsertText(values: Object) {
  return Object.entries(values)
    .sort()
    .reduce(
      (pre, [key, type], curIndex, array) => {
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

export function WhereText(value: Object) {
  return Object.entries(value)
    .sort()
    .map(([key, value]) => {
      return `${key} ${
        typeof value === "string"
          ? `= '${value}'`
          : !value
          ? "is null"
          : `= ${value}`
      }`;
    })
    .join(" AND ");
}

export function UpdateText(value: Object) {
  return Object.entries(value)
    .sort()
    .map(([key, value]) => {
      return `${key} ${
        typeof value === "string"
          ? `= '${value}'`
          : !value
          ? "is null"
          : `= ${value}`
      }`;
    })
    .join(", ");
}

export function AddText(value: Object) {
  return Object.entries(value as Record<string, string>)
    .sort()
    .map(([key, value]) => {
      if (value.trim() === "++" || value.trim() === "--") {
        let value_text = "";
        if (value.trim() === "++") {
          value_text = "+ 1";
        } else {
          value_text = "- 1";
        }

        return `${key} = IFNULL(${key}, 1) ${value_text}`;
      }
      return `${key} = IFNULL(${key}, 1) ${value}`;
    })
    .join(", ");
}

export function FilterText(value: Partial<NumericFilter<any>>) {
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
