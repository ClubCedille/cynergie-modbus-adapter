import { ModbusReader, ValueItem } from 'modbus-reader';
import { register, Gauge } from 'prom-client';
import * as express from 'express';

const config = require('../config.json') as { controllers: any[]; };

const args = process.argv.slice(2);
const debugMode = args.length === 1;
debugMode && console.warn('Debug mode enabled!');

const reader = new ModbusReader(config.controllers, debugMode);

const gauges = new Map<ValueItem, Gauge>();
for (const valueItem of reader.getAllValueItems()) {
	const label = `${valueItem.controller.name}_${valueItem.label}`;
	const gauge = new Gauge({ name: label, help: label, labelNames: ["unit", "parameter"] });
	gauges.set(valueItem, gauge);
}

reader.addValueListener(v => {
	const gauge = gauges.get(v.valueItem);
	if (!gauge) throw new Error("Undefined gauge for ValueItem");
	gauge.set({
		unit: v.valueItem.unit,
		parameter: v.valueItem.label
	}, v.data, v.time);
});

reader.start();
console.log(`Service started`);

//expose metrics
const server = express();
server.get('/metrics', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(register.metrics());
});

console.log('Server listening to 3000, metrics exposed on /metrics endpoint');
server.listen(3000);
