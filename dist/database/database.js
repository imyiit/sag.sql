"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const utils_1 = require("../utils");
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
        const filter = options && options.filter
            ? typeof options.filter === "string"
                ? options.filter
                : (0, utils_1.FilterText)(options.filter)
            : "";
        const limit_text = options && options.limit ? (0, utils_1.LimitText)(options.limit) : "";
        return this.db.prepare(`SELECT ${get} FROM ${this.table} ${(0, utils_1.WhereWithFilter)(where_text, filter)} ${limit_text}`);
    }
    findAll(value, options) {
        return this.find(value, options).all();
    }
    findOne(value, options) {
        return this.find(value, options).get();
    }
    update({ where, value, }, options) {
        const values_text = (0, utils_1.UpdateText)(value || {}, this.types);
        if (!values_text || values_text.length === 0) {
            throw new utils_1.SagError("Update", utils_1.SagErrorMsg.ValueZero);
        }
        const filter = options && options.filter
            ? typeof options.filter === "string"
                ? options.filter
                : (0, utils_1.FilterText)(options.filter)
            : "";
        const where_text = (0, utils_1.WhereText)(where || {}, this.types);
        const limit_text = options && options.limit ? (0, utils_1.LimitText)(options.limit) : "";
        this.db.exec(`UPDATE ${this.table} SET ${values_text} ${(0, utils_1.WhereWithFilter)(where_text, filter)} ${limit_text}`);
        return this;
    }
    add({ value, where, }, options) {
        const values_text = (0, utils_1.AddText)(value || {}, this.types);
        if (!values_text || values_text.length === 0) {
            throw new utils_1.SagError("Add", utils_1.SagErrorMsg.ValueZero);
        }
        const filter = options && options.filter
            ? typeof options.filter === "string"
                ? options.filter
                : (0, utils_1.FilterText)(options.filter)
            : "";
        const where_text = (0, utils_1.WhereText)(where || {}, this.types);
        const limit_text = options && options.limit ? (0, utils_1.LimitText)(options.limit) : "";
        this.db.exec(`UPDATE ${this.table} SET ${values_text} ${(0, utils_1.WhereWithFilter)(where_text, filter)} ${limit_text}`);
        return this;
    }
    delete(where, options) {
        const where_text = (0, utils_1.WhereText)(where || {}, this.types);
        const filter = options && options.filter
            ? typeof options.filter === "string"
                ? options.filter
                : (0, utils_1.FilterText)(options.filter)
            : "";
        const limit_text = options && options.limit ? (0, utils_1.LimitText)(options.limit) : "";
        this.db.exec(`DELETE FROM ${this.table} ${(0, utils_1.WhereWithFilter)(where_text, filter)} ${limit_text}`);
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
