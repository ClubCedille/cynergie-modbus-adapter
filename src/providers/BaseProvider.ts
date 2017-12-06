export class BaseProvider {
	private _host: string;
	private _port: number;
	private _deviceNumber: number;

	/** Address IP of the host */
	get host(): string { return this._host; }

	/** Port to use for ModBus connection */
	get port(): number { return this._port; }
	
	/** Device number, or slave id for chained devices */
	get deviceNumber(): number { return this._deviceNumber; }

	/**
	 * Creates an instance of BaseProvider.
	 * @param {string} host IP Address of the device
	 * @param {number} port Port to use for connection
	 * @param {number} deviceNumber Device number / Slave ID
	 * 
	 * @memberof BaseProvider
	 */
	constructor(host: string, port: number, deviceNumber: number) {
		this._host = host;
		this._port = port;
		this._deviceNumber = deviceNumber;
	}

	/** Establish connection to device */
	connect(): Promise<any> {
		return Promise.resolve();
	}

	/** Read the specified number of register from the address */
	read(address: number, nbRegisters: number): Promise<any> {
		throw new Error('Not implemented');
	}

	/** Close the connection */
	close(): void {}
}
