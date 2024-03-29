"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitText = exports.WhereWithFilter = exports.FilterText = exports.AddText = exports.UpdateText = exports.WhereText = exports.InsertText = exports.CreateKey = void 0;
function CreateKey(values) {
    return Object.entries(values)
        .sort()
        .map(([key, type]) => {
        return `${key} ${type}`;
    })
        .join(", ");
}
exports.CreateKey = CreateKey;
function InsertText(values, types) {
    return Object.entries(values)
        .sort()
        .reduce((pre, [key, type], curIndex, array) => {
        if (types && types[key].includes("PRIMARY KEY"))
            return pre;
        const comma = curIndex !== array.length - 1 ? ", " : "";
        pre.keys += `${key}${comma}`;
        pre.values += `${typeof type === "string"
            ? `'${type}'`
            : typeof type === "undefined"
                ? null
                : type}${comma}`;
        return pre;
    }, { keys: "", values: "" });
}
exports.InsertText = InsertText;
function WhereText(value, types) {
    return Object.entries(value)
        .sort()
        .map(([key, value]) => {
        if (types[key].includes("PRIMARY KEY"))
            return "";
        return `${key} ${typeof value === "string"
            ? `= '${value}'`
            : !value
                ? "is null"
                : `= ${value}`}`;
    })
        .join(" AND ");
}
exports.WhereText = WhereText;
function UpdateText(value, types) {
    return Object.entries(value)
        .sort()
        .map(([key, value]) => {
        if (types && types[key].includes("PRIMARY KEY"))
            return "";
        return `${key} ${typeof value === "string"
            ? `= '${value}'`
            : !value
                ? "is null"
                : `= ${value}`}`;
    })
        .join(", ");
}
exports.UpdateText = UpdateText;
function AddText(value, types) {
    return Object.entries(value)
        .sort()
        .map(([key, value]) => {
        if (types && types[key].includes("PRIMARY KEY"))
            return "";
        if (value.trim() === "++" || value.trim() === "--") {
            let value_text = "";
            if (value.trim() === "++") {
                value_text = "+ 1";
            }
            else {
                value_text = "- 1";
            }
            return `${key} = IFNULL(${key}, 1) ${value_text}`;
        }
        return `${key} = IFNULL(${key}, 1) ${value}`;
    })
        .join(", ");
}
exports.AddText = AddText;
function FilterText(value) {
    return Object.keys(value)
        .map((key) => {
        if (!value)
            return "";
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
exports.FilterText = FilterText;
function WhereWithFilter(where_text, filter) {
    return `${where_text.length > 0 || filter.length > 0 ? "WHERE" : ""} ${where_text.length > 0 ? `${where_text}` : ""} ${filter.length > 0 ? (where_text.length > 0 ? `AND ${filter}` : filter) : ""}`;
}
exports.WhereWithFilter = WhereWithFilter;
function LimitText(limit) {
    return `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`;
}
exports.LimitText = LimitText;
