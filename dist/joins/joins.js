"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joins = void 0;
const utils_1 = require("../utils");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class Joins {
    constructor(tableL, tableR, join) {
        this.tableL = tableL;
        this.tableR = tableR;
        if (this.tableL.folder_name !== this.tableR.folder_name)
            throw new utils_1.SagError("Database", utils_1.SagErrorMsg.NotSameFolder);
        if (this.tableL.table === this.tableR.table)
            throw new utils_1.SagError("Database", utils_1.SagErrorMsg.NotSameTableName);
        this.join = join ? join : "INNER JOIN";
        this.db = new better_sqlite3_1.default(`./${tableL.folder_name}.sqlite3`);
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.tableL.table} (${(0, utils_1.CreateKey)(this.tableL.types)})`);
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.tableR.table} (${(0, utils_1.CreateKey)(this.tableR.types)})`);
    }
    find(options) {
        const get = options && options.get
            ? options.get === "all"
                ? "*"
                : (0, utils_1.GetText)(options.get)
            : "*";
        const limit_text = options && options.limit ? (0, utils_1.LimitText)(options.limit) : "";
        return this.db
            .prepare(`SELECT ${get} FROM ${this.tableL.table} ${this.join} ${this.tableR.table} ${(options === null || options === void 0 ? void 0 : options.filter) ? `ON (${options.filter})` : ""} ${limit_text}`)
            .all();
    }
}
exports.Joins = Joins;
