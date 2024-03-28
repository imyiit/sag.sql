"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
class Filter {
    constructor(settings) {
        this.types = settings.types;
        this.keys = Object.keys(this.types);
        this.keywords = {};
        this.id = 0;
    }
    keywordBuilder(values, keyword) {
        values.forEach((value) => {
            if (!Array.isArray(this.keywords[this.id])) {
                this.keywords[this.id] = [];
            }
            this.keywords[this.id].push({ value, keyword });
        });
        this.id++;
    }
    or(values) {
        this.keywordBuilder(values, "OR");
        return this;
    }
    and(values) {
        this.keywordBuilder(values, "AND");
        return this;
    }
    between(...values) {
        if (!Array.isArray(values))
            return this;
        if (values.length === 0)
            return this;
        values.forEach((value) => {
            var _a, _b;
            const key = Object.keys(value)[0];
            if (!key)
                return this;
            if (!Array.isArray(this.keywords[this.id])) {
                this.keywords[this.id] = [];
            }
            this.keywords[this.id].push({
                value: `${key} BETWEEN ${(_a = value[key]) === null || _a === void 0 ? void 0 : _a[0]} AND ${(_b = value[key]) === null || _b === void 0 ? void 0 : _b[1]}`,
                keyword: "AND",
            });
        });
        this.id++;
        return this;
    }
    in(...values) {
        if (!Array.isArray(values))
            return this;
        if (values.length === 0)
            return this;
        values.forEach((value) => {
            var _a;
            const key = Object.keys(value)[0];
            if (!key)
                return this;
            if (!Array.isArray(this.keywords[this.id])) {
                this.keywords[this.id] = [];
            }
            this.keywords[this.id].push({
                value: `${key} IN (${(_a = value[key]) === null || _a === void 0 ? void 0 : _a.map((val) => typeof val === "string"
                    ? `'${val}'`
                    : typeof val === "boolean"
                        ? val === false
                            ? 0
                            : 1
                        : val)})`,
                keyword: "AND",
            });
        });
        this.id++;
        return this;
    }
    build() {
        this.id = 0;
        const copyKw = Object.assign({}, this.keywords);
        this.keywords = {};
        return Object.keys(copyKw)
            .map((_, i) => {
            const values = copyKw[i];
            return `(${values
                .map((v, _, array) => (array.length === 1 ? v.value : `(${v.value})`))
                .join(` ${values[0].keyword} `)})`;
        })
            .join(" AND ");
    }
}
exports.Filter = Filter;
