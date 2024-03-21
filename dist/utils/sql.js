"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateText = exports.WhereText = exports.InsertText = exports.CreateKey = void 0;
function CreateKey(values) {
    return Object.entries(values)
        .sort()
        .reduce((pre, [key, type], curIndex, array) => {
        const comma = curIndex !== array.length - 1 ? ", " : "";
        pre += `${key} ${type}${comma}`;
        return pre;
    }, "");
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
        .reduce((pre, [key, value], curIndex, array) => {
        if (types[key].includes("PRIMARY KEY"))
            return pre;
        const and = curIndex !== array.length - 1 ? " AND " : "";
        pre += `${key} ${typeof value === "string"
            ? `= '${value}'`
            : !value
                ? "is null"
                : `= ${value}`}${and}`;
        return pre;
    }, "");
}
exports.WhereText = WhereText;
function UpdateText(value, types) {
    return Object.entries(value)
        .sort()
        .reduce((pre, [key, value], curIndex, array) => {
        if (types && types[key].includes("PRIMARY KEY"))
            return pre;
        const comma = curIndex !== array.length - 1 ? ", " : "";
        pre += `${key} ${typeof value === "string"
            ? `= '${value}'`
            : !value
                ? "is null"
                : `= ${value}`}${comma}`;
        return pre;
    }, "");
}
exports.UpdateText = UpdateText;
