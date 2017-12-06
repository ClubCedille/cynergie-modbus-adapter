"use strict";
// WARNING, be cautious by manipulating UTC/Local and dates operations
Object.defineProperty(exports, "__esModule", { value: true });
/** Returns the current local-tz date as YYYY-MM-DD HH:MM:SS */
function getCurrentSqlLocal() {
    return getSqlLocal(new Date());
}
exports.getCurrentSqlLocal = getCurrentSqlLocal;
/** Returns the current UTC date as YYYY-MM-DD HH:MM:SS */
function getCurrentSqlUtc() {
    return getSqlUtc(new Date());
}
exports.getCurrentSqlUtc = getCurrentSqlUtc;
/** Returns the local-tz date as YYYY-MM-DD HH:MM:SS */
function getSqlLocal(date) {
    return date.getUTCFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
}
exports.getSqlLocal = getSqlLocal;
/** Returns the UTC date as YYYY-MM-DD HH:MM:SS */
function getSqlUtc(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
exports.getSqlUtc = getSqlUtc;
/**  Convert an ISO local date to UTC Date, e.g. 2015-11-24T19:40:00 */
function parseISOLocal(strISODate) {
    const b = strISODate.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}
exports.parseISOLocal = parseISOLocal;
