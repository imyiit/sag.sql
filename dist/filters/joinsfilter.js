"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinsFilter = void 0;
class JoinsFilter {
    constructor(joins) {
        this.buildTextArray = [];
        this.joins = joins;
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
        const converted = values.map(([val1, val2, val3]) => this.text(val1, val2, val3));
        this.and_or_maker(converted, "AND");
        return this;
    }
    or(...values) {
        if (!values || values.length === 0)
            return this;
        const converted = values.map(([val1, val2, val3]) => this.text(val1, val2, val3));
        this.and_or_maker(converted, "OR");
        return this;
    }
    text(value1, expression, value2) {
        return `${this.joins.tableL.table}.${String(value1)}${expression}${this.joins.tableR.table}.${String(value2)}`;
    }
    build() {
        const text = `${this.buildTextArray
            .map((txt) => `(${txt})`)
            .join(" AND ")}`;
        this.buildTextArray = [];
        return (!text.length ? "" : `${text}`);
    }
}
exports.JoinsFilter = JoinsFilter;
