"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
class Setting {
    constructor({ table = "local", types, folder_name = "sqlite", replace = false, }) {
        this.table = table;
        this.types = types;
        this.folder_name = folder_name;
        this.replace = replace;
    }
}
exports.Setting = Setting;
