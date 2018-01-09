import * as fs from 'fs';
import { getSqlLocal } from './DateHelper';

const REPORTS_DIR = './reports/'

export class CsvHelper {
	/** Returns the name used to save yesterday extract */
	static getYesterdayName(): string {
		let date = new Date();
		date.setDate(date.getDate() - 1);
		const strFullDate = getSqlLocal(date);
		const strDate = strFullDate.slice(0, 10);
		return strDate + '.csv';
	}

	/** Returns the name used to save last month extract */
	static getLastMonthName(): string {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);
		return CsvHelper.getYearMonth(date) + '.csv';
	}

	/** Returns all possibles names inside a month */
	static getAllNamesFromLastMonth(): string[] {
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
	static cleanLastMonthFiles(): void {
		CsvHelper.getAllNamesFromLastMonth().forEach(name => {
			const path = REPORTS_DIR + name;
			fs.unlink(path, () => console.log('[' + new Date().toISOString() + '] delete: ' + path));
		});
	}

	/** Returns YYYY-MM from a Date */
	private static getYearMonth(date: Date): string {
		const fullDate = getSqlLocal(date);
		return fullDate.slice(0, 7);
	}

	/** Returns the list of days inside a month */
	private static getDaysInMonth(date: Date): number[] {
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
