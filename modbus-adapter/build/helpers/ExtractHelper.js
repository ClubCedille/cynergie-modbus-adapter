"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RowExtractor_1 = require("../extractors/RowExtractor");
const CsvHelper_1 = require("./CsvHelper");
/** Max float precision to be printed */
const MAX_PRECISION = 4;
class ExtractHelper {
    /**
     * Creates the daily CSV report for "yesterday" based on current local day
     * @param {Storage} storage
     */
    static yesterday(storage) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const extractor = new RowExtractor_1.RowExtractor();
        ExtractHelper.configureExtractor(extractor);
        extractor.setReader((callback, endCb) => storage.read(yesterday, callback, endCb));
        extractor.writeCSV(CsvHelper_1.CsvHelper.getYesterdayName(), ',', '"', nbRow => {
            console.log(`Daily report done! ${nbRow} row(s) extracted.`);
        });
    }
    /**
     * Creates the month CSV report for past month based on current local month
     * @param {Storage} storage
     */
    static lastMonth(storage) {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const extractor = new RowExtractor_1.RowExtractor();
        ExtractHelper.configureExtractor(extractor);
        extractor.setReader((callback, endCb) => storage.readMonth(lastMonth.getFullYear(), lastMonth.getMonth(), callback, endCb));
        extractor.writeCSV(CsvHelper_1.CsvHelper.getLastMonthName(), ',', '"', nbRow => {
            console.log(`Monthly report done! ${nbRow} row(s) extracted.`);
        });
    }
    /** Configure the extract about column names and how to format rows from DB */
    static configureExtractor(extractor) {
        extractor.setColumnNames('Timestamp UTC', 'Timestamp', 'Value', 'Source', 'Measurement', 'Unit');
        extractor.setFormatFunction(row => {
            const val = row['value'] ? row['value'].toFixed(MAX_PRECISION) : 'NULL';
            return [row['date_utc'], row['date_local'], val, row['controller'], row['register'], row['unit']];
        });
    }
}
exports.ExtractHelper = ExtractHelper;
