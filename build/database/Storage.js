"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const DateHelper_1 = require("../helpers/DateHelper");
class Storage {
    /**
     * Creates an instance of Storage.
     * @param {boolean} [inMemory=false] Determine if the DB should be kept only in memory
     * @param {DateSource} [dateSource='date_local'] Define the default date to manipulate
     */
    constructor(inMemory = false, dateSource = 'date_local') {
        this._stmt = sqlite3_1.Statement;
        this._dateSource = dateSource;
        const dbName = inMemory ? ':memory:' : 'localdb.sqlite';
        this._db = new sqlite3_1.Database(dbName);
    }
    /** Just assure that the DB exists */
    migrate() {
        this._db.run(`CREATE TABLE IF NOT EXISTS history (
						date_utc INTEGER,
						date_local INTEGER,
						value REAL,
						controller TEXT,
						register TEXT,
						unit TEXT)`);
    }
    /** Saves a dataitem into DB */
    save(dataItem) {
        this._db.serialize(() => {
            this.migrate();
            this._stmt = this._db.prepare('INSERT INTO history VALUES (?, ?, ?, ?, ?, ?)');
            dataItem.data.forEach(d => {
                this._stmt.run(DateHelper_1.getSqlUtc(dataItem.time), DateHelper_1.getSqlLocal(dataItem.time), d.data, dataItem.name, d.label, d.unit);
            });
            this._stmt.finalize();
        });
    }
    /**
     * Reads data for a day
     * @param {Date} date Day you want to read
     * @param {RowFunction} fn RowFunction, called at each row retrieved
     * @param {Function} endFn  Called when request has been fully processed
     */
    read(date, fn, endFn) {
        this._db.serialize(() => {
            const sqlDate = DateHelper_1.getSqlUtc(date).substr(0, 10);
            const src = this._dateSource;
            this._db.each(`
				SELECT date_utc, date_local, value, controller, register, unit
				FROM history
				WHERE date(${src}) = date('${sqlDate}')
				ORDER BY ${src}`, fn, endFn);
        });
    }
    /**
     * Reads data for a month
     * @param {number} year Year to consider
     * @param {number} month Month to consider
     * @param {RowFunction} fn RowFunction, called at each row retrieved
     * @param {Function} endFn  Called when request has been fully processed
     */
    readMonth(year, month, fn, endFn) {
        this._db.serialize(() => {
            const src = this._dateSource;
            this._db.each(`
				SELECT cast(strftime('%m%Y', ${src}) as int) as monthyear, date_utc, date_local, value, controller, register, unit
				FROM history
				WHERE monthyear = ${month}${year}
				ORDER BY ${src}`, fn, endFn);
        });
    }
    /**
     * Extract data from DB inside: [startDate;endDate]
     * @param {Date} startDate Begin of the interval
     * @param {Date} endDate End of the interval (inclusive)
     * @param {boolean} considerTime Should request with exact time or based on date only
     * @param {RowFunction} fn RowFunction, called at each row retrieved
     * @param {Function} endFn Called when request has been fully processed
     */
    readInterval(startDate, endDate, considerTime, fn, endFn) {
        if (considerTime)
            throw new Error('Retrieving based on date+time is not yet supported.');
        this._db.serialize(() => {
            const start = DateHelper_1.getSqlUtc(startDate).slice(0, 10);
            const end = DateHelper_1.getSqlUtc(endDate).slice(0, 10);
            const src = this._dateSource;
            this._db.each(`
				SELECT date_utc, date_local, value, controller, register, unit
				FROM history
				WHERE date(${src}) BETWEEN date('${start}') AND date('${end}')`, fn, endFn);
        });
    }
    /** Remove data older than specified days */
    cleanOldData(keepDays) {
        this._db.serialize(() => {
            const src = this._dateSource;
            const triggerDate = new Date();
            triggerDate.setDate(triggerDate.getDate() - keepDays);
            const triggerStrDate = DateHelper_1.getSqlLocal(triggerDate).slice(0, 10);
            this._db.run(`
				DELETE FROM history
				WHERE date(${src}) < date('${triggerStrDate}')`);
        });
    }
    close() {
        // Keep it open
        // this._db.close();
    }
}
exports.Storage = Storage;
