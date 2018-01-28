"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModbusRTU = require("modbus-serial");
const BaseProvider_1 = require("./BaseProvider");
class ModBusProvider extends BaseProvider_1.BaseProvider {
    constructor(host, port, deviceNumber) {
        super(host, port, deviceNumber);
        this._client = new ModbusRTU();
        this._client.setID(this.deviceNumber);
    }
    /** Establish a TCP connection to device */
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this._client.connectTCP(this.host, { port: this.port }, resolve);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /** Read the specified number of register from the address */
    read(address, nbRegisters) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._client.readHoldingRegisters(address, nbRegisters);
            console.log("R", address, nbRegisters, data);
            return data;
        });
    }
    /** Close the connection */
    close() {
        return this._client.close(() => { });
    }
}
exports.ModBusProvider = ModBusProvider;
