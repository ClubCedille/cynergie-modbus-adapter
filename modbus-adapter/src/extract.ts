import * as fs from 'fs';
import { Storage, RowFunction } from './database/Storage';
import { RowExtractor } from './extractors/RowExtractor';
import { parseISOLocal } from './helpers/DateHelper';

const args = process.argv.slice(2);
if (args.length !== 3) {
	console.log('Usage: npm run extract [start_date] [end_date] [output_file]');
	console.log('   ex: npm run extract 2017-06-02 2017-06-03 extract.csv');
	console.log('       This tool will work with local timezone');
	process.exit();
}
const [start, end, file] = args;
const startDate = parseISOLocal(start + 'T00:00:00');
const endDate = parseISOLocal(end + 'T00:00:00');

const MAX_PRECISION = 4;

const storage = new Storage(false);
const extractor = new RowExtractor('./reports/custom/');
extractor.setReader((callback: RowFunction, endCb: Function) => storage.readInterval(startDate, endDate, false, callback, endCb));
extractor.setColumnNames('Timestamp UTC', 'Timestamp', 'Value', 'Source', 'Measurement', 'Unit');
extractor.setFormatFunction(row => {
	const val = row['value'] ? row['value'].toFixed(MAX_PRECISION) : 'NULL';
	return [row['date_utc'], row['date_local'], val, row['controller'], row['register'], row['unit']];
});
extractor.writeCSV(file, ',', '"', nbRow => {
	console.log(`Done! ${nbRow} row(s) extracted.`);
});
