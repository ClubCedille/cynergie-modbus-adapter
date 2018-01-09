"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeBufferHelper_1 = require("../helpers/TypeBufferHelper");
/** One native register is 2 bytes */
exports.REGISTER_LENGTH = 16;
class Register {
    /** Label of the register */
    get label() { return this._label; }
    /** Address of the register */
    get address() { return this._address; }
    /** Type of the register for later buffer conversion */
    get type() { return this._type; }
    /** Dynamically calculated number of native registers */
    get nbNativeRegisters() { return TypeBufferHelper_1.TypeBufferHelper.getNbRegisters(this.type, exports.REGISTER_LENGTH); }
    /** Units used to describe the value */
    get unit() { return this._unit; }
    /** Coefficient to apply after reading */
    get coefficient() { return this._coefficient; }
    constructor(conf) {
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
    convertValue(rawValue) {
        return rawValue * this.coefficient;
    }
}
exports.Register = Register;
