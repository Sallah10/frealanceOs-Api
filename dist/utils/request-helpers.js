"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringParam = getStringParam;
exports.getNumberParam = getNumberParam;
exports.getBooleanParam = getBooleanParam;
exports.getStringParamOrDefault = getStringParamOrDefault;
function getStringParam(value) {
    if (!value)
        return undefined;
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === 'string' ? first : undefined;
    }
    return undefined;
}
function getNumberParam(value, defaultValue) {
    const str = getStringParam(value);
    if (!str)
        return defaultValue;
    const num = parseInt(str, 10);
    return isNaN(num) ? defaultValue : num;
}
function getBooleanParam(value, defaultValue) {
    const str = getStringParam(value);
    if (!str)
        return defaultValue;
    if (str === 'true' || str === '1')
        return true;
    if (str === 'false' || str === '0')
        return false;
    return defaultValue;
}
function getStringParamOrDefault(value, defaultValue = '') {
    const str = getStringParam(value);
    return str ?? defaultValue;
}
//# sourceMappingURL=request-helpers.js.map