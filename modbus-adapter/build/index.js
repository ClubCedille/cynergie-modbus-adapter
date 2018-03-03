"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modbus_reader_1 = require("modbus-reader");
const prom_client_1 = require("prom-client");
const express = require("express");
const config = require('../config.json');
const args = process.argv.slice(2);
const debugMode = args.length === 1;
debugMode && console.warn('Debug mode enabled!');
const reader = new modbus_reader_1.ModbusReader(config.controllers, debugMode);
const gauges = new Map();
for (const valueItem of reader.getAllValueItems()) {
    const label = `${valueItem.controller.name}_${valueItem.label}`;
    const gauge = new prom_client_1.Gauge({ name: label, help: label, labelNames: ["unit", "parameter"] });
    gauges.set(valueItem, gauge);
}
reader.addValueListener(v => {
    const gauge = gauges.get(v.valueItem);
    if (!gauge)
        throw new Error("Undefined gauge for ValueItem");
    gauge.set({
        unit: v.valueItem.unit,
        parameter: v.valueItem.label
    }, v.data, v.time);
    console.log({
        unit: v.valueItem.unit,
        parameter: v.valueItem.label
    }, v.data, v.time);
});
reader.start();
console.log(`Service started`);
//expose metrics
const server = express();
server.get('/metrics', (req, res) => {
    res.set('Content-Type', prom_client_1.register.contentType);
    res.end(prom_client_1.register.metrics());
});
console.log('Server listening to 3000, metrics exposed on /metrics endpoint');
server.listen(3000);
