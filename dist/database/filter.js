"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFilter = void 0;
class DatabaseFilter {
    constructor(setting) {
        this.buildTextArray = [];
        this.types = setting.types;
    }
    and_or_maker(values, type) {
        if (values.length === 1) {
            this.buildTextArray.push(`${values[0]}`);
            return this;
        }
        this.buildTextArray.push(`${values.join(` ${type} `)}`);
        return this;
    }
    and(...values) {
        if (!values || values.length === 0)
            return this;
        this.and_or_maker(values, "AND");
        return this;
    }
    or(...values) {
        if (!values || values.length === 0)
            return this;
        this.and_or_maker(values, "OR");
        return this;
    }
    between(...values) {
        if (!values || !Array.isArray(values) || values.length === 0)
            return this;
        let betweenTexts = [];
        values.forEach((val) => {
            Object.keys(val).forEach((k) => {
                betweenTexts.push(`${k} BETWEEN ${val[k][0]} AND ${val[k][1]}`);
            });
        });
        if (betweenTexts.length === 0)
            return this;
        this.buildTextArray.push(`${betweenTexts.join(" AND ")}`);
        return this;
    }
    in(...values) {
        if (!values || !Array.isArray(values) || values.length === 0)
            return this;
        let betweenTexts = [];
        values.forEach((val) => {
            Object.keys(val).forEach((k) => {
                var _a;
                betweenTexts.push(`${k} IN (${(_a = val[k]) === null || _a === void 0 ? void 0 : _a.map((v) => typeof v === "string"
                    ? `'${v}'`
                    : typeof v === "boolean"
                        ? v === false
                            ? 0
                            : 1
                        : v).join(",")})`);
            });
        });
        if (betweenTexts.length === 0)
            return this;
        this.buildTextArray.push(`${betweenTexts.join(" AND ")}`);
        return this;
    }
    build() {
        const text = `${this.buildTextArray
            .map((txt) => `(${txt})`)
            .join(" AND ")}`;
        this.buildTextArray = [];
        return (!text.length ? "" : `${text}`);
    }
}
exports.DatabaseFilter = DatabaseFilter;
