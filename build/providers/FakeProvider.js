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
            return resolve({
                data: new Array(nbRegisters).fill(0),
                buffer: new Buffer(nbRegisters * nbBytesPerRegister)
            });
        });
    }
}
exports.FakeProvider = FakeProvider;
