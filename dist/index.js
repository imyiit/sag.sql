"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const utils_1 = require("./utils");
class Database {
    constructor({ table = "local", types, folder_name = "sqlite", replace = false, }) {
        this.table = table;
        this.types = types;
        this.folder_name = folder_name;
        this.replace = replace;
        const keys = (0, utils_1.CreateKey)(this.types);
        if (keys.length === 0)
            throw new utils_1.SagError("Database", utils_1.SagErrorMsg.TypesZero);
        this.db = new better_sqlite3_1.default(`./${this.folder_name}.sqlite3`);
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.table} (${keys})`);
    }
    set(value) {
        const { keys, values } = (0, utils_1.InsertText)(value, this.types);
        if (!keys || !values)
            return this;
        this.db.exec(`INSERT OR ${this.replace ? "REPLACE" : "IGNORE"} INTO ${this.table} (${keys}) VALUES (${values})`);
        return this;
    }
    find(value, options) {
        const where_text = (0, utils_1.WhereText)(value, this.types);
        const get = options && options.get
            ? options.get === "all"
                ? "*"
                : options.get
                    .map((_val) => _val.toString().toLowerCase())
                    .filter((value, index, array) => array.indexOf(value) === index)
                    .sort()
                    .reduce((pre, cur, curIndex, array) => {
                    const comma = curIndex !== array.length - 1 ? ", " : "";
                    pre += `${cur}${comma}`;
                    return pre;
                }, "")
            : "*";
        const orderBy = options && options.orderBy
            ? Object.keys(options.orderBy)
                .map((key) => {
                if (!options.orderBy)
                    return "";
                if (key === "or") {
                    const vals = options.orderBy[key];
                    if (vals && vals.length > 0) {
                        return vals.join(" OR ");
                    }
                    return "";
                }
                if (key === "and") {
                    const vals = options.orderBy[key];
                    if (vals && vals.length > 0) {
                        return vals.join(" AND ");
                    }
                    return "";
                }
                if (key === "in") {
                    const vals = options.orderBy[key];
                    if (vals && vals.length > 0) {
                        return vals
                            .map((val) => {
                            return `${val.key.toString()} IN (${val.list
                                .map((item) => typeof item === "string" ? `'${item}'` : item)
                                .join(",")})`;
                        })
                            .join(" AND ");
                    }
                    return "";
                }
            })
                .join(" AND ")
            : "";
        return this.db.prepare(`SELECT ${get} FROM ${this.table} ${where_text.length > 0 || orderBy.length > 0 ? "WHERE" : ""} ${where_text.length > 0 ? `${where_text}` : ""} ${orderBy.length > 0
            ? where_text.length > 0
                ? `AND ${orderBy}`
                : orderBy
            : ""} ${options && options.limit
            ? `LIMIT ${options.limit.max} ${options.limit.offSet ? `OFFSET ${options.limit.offSet}` : ""}`
            : ""}`);
    }
    findAll(value, options) {
        return this.find(value, options).all();
    }
    findOne(value, options) {
        return this.find(value, options).get();
    }
    update({ where, value, limit, }) {
        const values_text = (0, utils_1.UpdateText)(value, this.types);
        if (!values_text)
            throw new utils_1.SagError("Update", utils_1.SagErrorMsg.TypesZero);
        const where_text = (0, utils_1.WhereText)(where, this.types);
        this.db.exec(`UPDATE ${this.table} SET ${values_text} ${where_text.length > 0 ? `WHERE ${where_text}` : ""} ${limit
            ? `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`
            : ""}`);
        return this;
    }
    delete({ where, limit, }) {
        const where_text = (0, utils_1.WhereText)(where || {}, this.types);
        this.db.exec(`DELETE FROM ${this.table} ${where_text.length > 0 ? `WHERE ${where_text}` : ""} ${limit
            ? `LIMIT ${limit.max} ${limit.offSet ? `OFFSET ${limit.offSet}` : ""}`
            : ""}`);
        return this;
    }
    deleteAll() {
        this.db.exec(`DELETE FROM ${this.table}`);
        return this;
    }
    all() {
        return this.db.prepare(`SELECT * FROM ${this.table}`).all();
    }
}
exports.Database = Database;
