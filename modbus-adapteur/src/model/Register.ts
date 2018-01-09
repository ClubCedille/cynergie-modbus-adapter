import { SupportedType, TypeBufferHelper } from '../helpers/TypeBufferHelper';

/** One native register is 2 bytes */
export const REGISTER_LENGTH = 16;

/** Configuration of a register as it should be represented in JSON configuration */
export interface RegisterConfiguration {
	label: string;
	address: number;
	type: SupportedType;
	unit: string;
	coefficient: number;
}

export class Register {
	private _label: string;
	private _address: number;
	private _type: SupportedType;
	private _unit: string;
	private _coefficient: number;

	/** Label of the register */
	get label(): string { return this._label; }

	/** Address of the register */
	get address(): number { return this._address; }

	/** Type of the register for later buffer conversion */
	get type(): SupportedType { return this._type; }

	/** Dynamically calculated number of native registers */
	get nbNativeRegisters(): number { return TypeBufferHelper.getNbRegisters(this.type, REGISTER_LENGTH); }

	/** Units used to describe the value */
	get unit(): string { return this._unit; }

	/** Coefficient to apply after reading */
	get coefficient(): number { return this._coefficient; }

	constructor(conf: RegisterConfiguration) {
		this._label = conf.label;
		this._address = conf.address;
		this._type = conf.type;
		this._unit = conf.unit;
		this._coefficient = conf.coefficient;
	}

	/**
	 * Convert the value with the provided coefficient
	 * @param {number} rawValue Value as read from the controller
	 * @returns {number} 
	 */
	convertValue(rawValue: number): number {
		return rawValue * this.coefficient;
	}
}
