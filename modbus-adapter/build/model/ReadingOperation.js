"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeBufferHelper_1 = require("../helpers/TypeBufferHelper");
class ReadingOperation {
    /** Stores the address of the register */
    get address() { return this._registers[0].address; }
    /** Gets dynamically the number of registers inside the reading operation */
    get nbRegisters() { return this._registers.map(r => r.nbNativeRegisters).reduce((p, c) => p + c); }
    constructor(register) {
        this._registers = [];
        this.addRegister(register);
    }
    /** Adds the register to the list for further data recomposition */
    addRegister(register) {
        if (!this.isMergeable(register)) {
            throw new Error('Can\'t merge discontinuous registers in one reading operation');
        }
        this._registers.push(register);
    }
    /** Checks if register is contiguous */
    isMergeable(register) {
        if (this._registers.length === 0) {
            return true;
        }
        return this.address + this.nbRegisters === register.address;
    }
    /** From buffer received, recomposes the values from previously added registers */
    recompose(buffer) {
        const values = [];
        let bufferOffset = 0;
        this._registers.forEach(r => {
            const readValue = TypeBufferHelper_1.TypeBufferHelper.read(r.type, buffer, bufferOffset);
            values.push({
                label: r.label,
                data: r.convertValue(readValue),
                unit: r.unit
            });
            bufferOffset += TypeBufferHelper_1.TypeBufferHelper.getLength(r.type) / 8;
        });
        return values;
    }
}
exports.ReadingOperation = ReadingOperation;
