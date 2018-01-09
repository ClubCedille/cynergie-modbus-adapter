import { RowFunction } from '../database/Storage';
import { CsvHelper } from '../helpers/CsvHelper';
import * as fs from 'fs';

/** Defines the type used to format a row */
export type FormatFunction = (row: any[]) => any[];

/** Defines the function type expected for reading process */
export type RowReader = (callback: RowFunction, endCb: Function) => void;

export class RowExtractor {
	private _reportDir: string;
	private _columns: string[];
	private _reader: RowReader;
	private _format: FormatFunction;

	/**
	 * Creates an instance of RowExtractor.
	 * @param {string} [reportDir='./reports/'] Specify where reports should be saved
	 */
	constructor(reportDir: string = './reports/') {
		this._reportDir = reportDir;
	}

	/** Defines the reader, using a RowFunction and final callback */
	setReader(reader: RowReader): void {
		this._reader = reader;
	}

	/** Defines column names for CSV export */
	setColumnNames(...headers: string[]): void {
		this._columns = headers;
	}

	/** Defines the function used to transform the row into an array of ready to be printed values */
	setFormatFunction(format: FormatFunction): void {
		this._format = format;
	}

	/**
	 * Creates the CSV files from the immediate output obtainer through the reader.
	 * @param {string} outputFile Determine the name of the file, would be concatenated to the reportDir
	 * @param {string} [separator=','] CSV separator
	 * @param {string} [delimiter='"'] CSV delimiter
	 * @param {Function} [next] Optional final callback
	 */
	writeCSV(outputFile: string, separator: string = ',', delimiter: string = '"', next?: Function): void {
		const outputStream = fs.createWriteStream(this._reportDir + outputFile, {'flags': 'w'});
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

	private csvify(values: any[], separator: string, delimiter: string): string {
		return values.map(v => delimiter + v + delimiter).join(separator) + '\n';
	}
}
