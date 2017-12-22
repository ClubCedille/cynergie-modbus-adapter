"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseProvider {
    /** Address IP of the host */
    get host() { return this._host; }
    /** Port to use for ModBus connection */
    get port() { return this._port; }
    /** Device number, or slave id for chained devices */
    get deviceNumber() { return this._deviceNumber; }
    /**
     * Creates an instance of BaseProvider.
     * @param {string} host IP Address of the device
     * @param {number} port Port to use for connection
     * @param {number} deviceNumber Device number / Slave ID
     *
     * @memberof BaseProvider
     */
    constructor(host, port, deviceNumber) {
        this._host = host;
        this._port = port;
        this._deviceNumber = deviceNumber;
    }
    /** Establish connection to device */
    connect() {
        return Promise.resolve();
    }
    /** Read the specified number of register from the address */
    read(address, nbRegisters) {
        throw new Error('Not implemented');
    }
    /** Close the connection */
    close() { }
}
exports.BaseProvider = BaseProvider;
