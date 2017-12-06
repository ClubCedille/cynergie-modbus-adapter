import { Register, RegisterConfiguration } from './Register';
import { ReadingOperation } from './ReadingOperation';

/** Determines what should be found inside the controller configuration from JSON file */
export interface ControllerConfiguration {
	name: string;
	address: string;
	port: number;
	slaveId: number;
	registers: RegisterConfiguration[];
}

export class Controller {
	private _name: string;
	private _address: string;
	private _port: number;
	private _slaveId: number;
	private _registers: Array<Register>;
	private _readingsReady: boolean;
	private _readings: Array<ReadingOperation>;

	/** */
	get name(): string { return this._name; }

	/** */
	get address(): string { return this._address; }

	/** */
	get port(): number { return this._port; }

	/** */
	get slaveId(): number { return this._slaveId; }

	/** */
	get registers(): Array<Register> { return this._registers; }

	/** */
	get readingsReady(): boolean { return this._readingsReady; }

	/** */
	get readings(): Array<ReadingOperation> { return this._readings; }

	/**
	 * Creates an instance of Controller.
	 * @param {ControllerConfiguration} conf Configuration obtained from JSON file
	 */
	constructor(conf: ControllerConfiguration) {
		this._name = conf.name;
		this._address = conf.address;
		this._port = conf.port;
		this._slaveId = conf.slaveId;
		this._registers = new Array();
		this._readingsReady = true;
	}

	/** Adds the register to the list if not already present */
	addRegister(register: Register): void {
		if (this.registers.indexOf(register) !== -1) {
			throw new Error('Register already bound to current controller');
		}

		this.registers.push(register);
		this._readingsReady = false;
	}

	/** Build the readings if any register in the list */
	generateReadings(): void {
		if (this._registers.length > 0) {
			this.optimizeReading();
		}
		this._readingsReady = true;
	}

	/** Optimizes the operations of reading to the controller by concatenating contiguous registers */
	protected optimizeReading(): void {
		this._readings = [];
		this.readings.push(new ReadingOperation(this.registers[0]));

		for (let i = 1 ; i < this.registers.length ; i++) {
			const currentReadingOperation = this.readings[this.readings.length - 1];
			const newRegister = this.registers[i];
			if (currentReadingOperation.isMergeable(newRegister)) {
				currentReadingOperation.addRegister(newRegister);
			} else {
				this.readings.push(new ReadingOperation(newRegister));
			}
		}
	}
}
