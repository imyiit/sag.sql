"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagError = exports.SagErrorMsg = void 0;
var SagErrorMsg;
(function (SagErrorMsg) {
    SagErrorMsg["TypesZero"] = "Database argument of 'types' need min one argument.";
    SagErrorMsg["ValueZero"] = "Value need min one argument.";
    SagErrorMsg["NotSameFolder"] = "Database folder name is not same!";
    SagErrorMsg["NotSameTableName"] = "Database table name cant same!";
})(SagErrorMsg || (exports.SagErrorMsg = SagErrorMsg = {}));
class SagError extends Error {
    constructor(type, text) {
        super(`${type} Error - ${text}`);
    }
}
exports.SagError = SagError;
