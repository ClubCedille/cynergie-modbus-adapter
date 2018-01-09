"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseProvider_1 = require("./BaseProvider");
const Register_1 = require("../model/Register");
class FakeProvider extends BaseProvider_1.BaseProvider {
    constructor(host, port, deviceNumber) {
        super(host, port, deviceNumber);
    }
    /** Gives an empty reading */
    read(address, nbRegisters) {
        const nbBytesPerRegister = Register_1.REGISTER_LENGTH / 8;
        return new Promise((resolve) => {
            const buffer = new Buffer(nbRegisters * nbBytesPerRegister);
            const offset = 0;
            let curAddr = address;
            for (let i = 0; i < nbRegisters; i++) {
                buffer.writeInt16BE(Math.floor(curAddr + Math.random() * (curAddr / 2)), i * 2);
                curAddr++;
            }
            return resolve({
                data: new Array(nbRegisters).fill(0),
                buffer: buffer
            });
        });
    }
}
exports.FakeProvider = FakeProvider;
