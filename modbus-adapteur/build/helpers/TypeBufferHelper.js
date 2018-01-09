"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeBufferHelper {
    /** Returns bits inside in a type, based on is name */
    static getLength(type) {
        return parseInt(type.slice(-2));
    }
    /** Returns the number of registers required to read a type with a specified register length */
    static getNbRegisters(type, registerLength) {
        return TypeBufferHelper.getLength(type) / registerLength;
    }
    /**
     * Gives the value from the buffer at the specified offset
     * @param {SupportedType} type Specify the type that should be read
     * @param {Buffer} buffer Buffer to read from
     * @param {number} [offset=0] Where to start the reading inside the buffer
     * @returns {number}
     */
    static read(type, buffer, offset = 0) {
        switch (type) {
            case 'INT16':
                return buffer.readInt16BE(offset);
            case 'UINT16':
                return buffer.readUInt16BE(offset);
            case 'INT32':
                return buffer.readInt32BE(offset);
            case 'UINT32':
                return buffer.readUInt32BE(offset);
            case 'FLOAT32':
                return buffer.readFloatBE(offset);
            default:
                throw new Error('Not supported type for buffer conversion.');
        }
    }
}
exports.TypeBufferHelper = TypeBufferHelper;
