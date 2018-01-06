"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class RowExtractor {
    /**
     * Creates an instance of RowExtractor.
     * @param {string} [reportDir='./reports/'] Specify where reports should be saved
     */
    constructor(reportDir = './reports/') {
        this._reportDir = reportDir;
    }
    /** Defines the reader, using a RowFunction and final callback */
    setReader(reader) {
        this._reader = reader;
    }
    /** Defines column names for CSV export */
    setColumnNames(...headers) {
        this._columns = headers;
    }
    /** Defines the function used to transform the row into an array of ready to be printed values */
    setFormatFunction(format) {
        this._format = format;
    }
    /**
     * Creates the CSV files from the immediate output obtainer through the reader.
     * @param {string} outputFile Determine the name of the file, would be concatenated to the reportDir
     * @param {string} [separator=','] CSV separator
     * @param {string} [delimiter='"'] CSV delimiter
     * @param {Function} [next] Optional final callback
     */
    writeCSV(outputFile, separator = ',', delimiter = '"', next) {
        const outputStream = fs.createWriteStream(this._reportDir + outputFile, { 'flags': 'w' });
        outputStream.write(this.csvify(this._columns, separator, delimiter));
        let nbRow = 0;
        this._reader((err, row) => {
            const separatedValues = this._format(row);
            const str = this.csvify(separatedValues, separator, delimiter);
            outputStream.write(str);
            nbRow += 1;
        }, () => {
            outputStream.end();
            next && next(nbRow);
        });
    }
    csvify(values, separator, delimiter) {
        return values.map(v => delimiter + v + delimiter).join(separator) + '\n';
    }
}
exports.RowExtractor = RowExtractor;
