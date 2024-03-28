"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
class Settings {
    constructor({ table = "local", types, folder_name = "sqlite", replace = false, }) {
        this.table = table;
        this.types = types;
        this.folder_name = folder_name;
        this.replace = replace;
    }
}
exports.Settings = Settings;
