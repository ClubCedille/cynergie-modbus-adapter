"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const DateHelper_1 = require("./DateHelper");
const REPORTS_DIR = './reports/';
class CsvHelper {
    /** Returns the name used to save yesterday extract */
    static getYesterdayName() {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        const strFullDate = DateHelper_1.getSqlLocal(date);
        const strDate = strFullDate.slice(0, 10);
        return strDate + '.csv';
    }
    /** Returns the name used to save last month extract */
    static getLastMonthName() {
        let date = new Date();
        date.setMonth(date.getMonth() - 1);
        return CsvHelper.getYearMonth(date) + '.csv';
    }
    /** Returns all possibles names inside a month */
    static getAllNamesFromLastMonth() {
        let date = new Date();
        date.setMonth(date.getMonth() - 1);
        const yearMonth = CsvHelper.getYearMonth(date);
        const days = CsvHelper.getDaysInMonth(date);
        return days.map(d => {
            const day = ('00' + d).slice(-2);
            return yearMonth + '-' + day + '.csv';
        });
    }
    /** Removes all daily reports from last month */
    static cleanLastMonthFiles() {
        CsvHelper.getAllNamesFromLastMonth().forEach(name => {
            const path = REPORTS_DIR + name;
            fs.unlink(path, () => console.log('[' + new Date().toISOString() + '] delete: ' + path));
        });
    }
    /** Returns YYYY-MM from a Date */
    static getYearMonth(date) {
        const fullDate = DateHelper_1.getSqlLocal(date);
        return fullDate.slice(0, 7);
    }
    /** Returns the list of days inside a month */
    static getDaysInMonth(date) {
        const month = date.getMonth();
        date.setDate(1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(date.getDate());
            date.setDate(date.getDate() + 1);
        }
        return days;
    }
}
exports.CsvHelper = CsvHelper;
