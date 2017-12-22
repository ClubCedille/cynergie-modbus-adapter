"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReadingOperation_1 = require("./ReadingOperation");
class Controller {
    /** */
    get name() { return this._name; }
    /** */
    get address() { return this._address; }
    /** */
    get port() { return this._port; }
    /** */
    get slaveId() { return this._slaveId; }
    /** */
    get registers() { return this._registers; }
    /** */
    get readingsReady() { return this._readingsReady; }
    /** */
    get readings() { return this._readings; }
    /**
     * Creates an instance of Controller.
     * @param {ControllerConfiguration} conf Configuration obtained from JSON file
     */
    constructor(conf) {
        this._name = conf.name;
        this._address = conf.address;
        this._port = conf.port;
        this._slaveId = conf.slaveId;
        this._registers = new Array();
        this._readingsReady = true;
    }
    /** Adds the register to the list if not already present */
    addRegister(register) {
        if (this.registers.indexOf(register) !== -1) {
            throw new Error('Register already bound to current controller');
        }
        this.registers.push(register);
        this._readingsReady = false;
    }
    /** Build the readings if any register in the list */
    generateReadings() {
        if (this._registers.length > 0) {
            this.optimizeReading();
        }
        this._readingsReady = true;
    }
    /** Optimizes the operations of reading to the controller by concatenating contiguous registers */
    optimizeReading() {
        this._readings = [];
        this.readings.push(new ReadingOperation_1.ReadingOperation(this.registers[0]));
        for (let i = 1; i < this.registers.length; i++) {
            const currentReadingOperation = this.readings[this.readings.length - 1];
            const newRegister = this.registers[i];
            if (currentReadingOperation.isMergeable(newRegister)) {
                currentReadingOperation.addRegister(newRegister);
            }
            else {
                this.readings.push(new ReadingOperation_1.ReadingOperation(newRegister));
            }
        }
    }
}
exports.Controller = Controller;
