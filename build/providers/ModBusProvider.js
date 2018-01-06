"use strict";
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
        return this._client.readHoldingRegisters(address, nbRegisters);
    }
    /** Close the connection */
    close() {
        return this._client.close(() => { });
    }
}
exports.ModBusProvider = ModBusProvider;
