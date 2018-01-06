"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule = require("node-schedule");
const ConfigHelper_1 = require("./helpers/ConfigHelper");
const DatasetHelper_1 = require("./helpers/DatasetHelper");
const FakeProvider_1 = require("./providers/FakeProvider");
const ModBusProvider_1 = require("./providers/ModBusProvider");
const config = require('../config.json');
//import for metrics server
const express = require('express');
const cluster = require('cluster');
const server = express();
const register = require('../node_modules/prom-client').register;
//creating gauge pour prometheus metric
const Gauge = require('../node_modules/prom-client').Gauge;
const g = new Gauge({
    name: 'voltage_gauge',
    help: 'Exemple voltage gauge',
    labelNames: ['unit', 'Batiment']
});
const controllers = ConfigHelper_1.createControllers(config.controllers);
const args = process.argv.slice(2);
const debugMode = args.length === 1;
if (debugMode) {
    console.warn('Debug mode enabled!');
}
console.log(`Service started (frq: ${config.readFrequency.interval}ms, occ: ${config.readFrequency.requiredOccurences})!`);
// Declare the functions used to retrieve data from each controllers
const ChosenProvider = debugMode ? FakeProvider_1.FakeProvider : ModBusProvider_1.ModBusProvider;
const controllerFetching = controllers.map(c => {
    const provider = new ChosenProvider(c.address, c.port, c.slaveId);
    return () => {
        const date = new Date();
        let promise = provider.connect();
        promise = promise.then(() => []);
        c.readings.forEach(r => {
            promise = promise.then((v) => provider.read(r.address, r.nbRegisters).then(raw => { v.push(r.recompose(raw.buffer)); return v; }));
        });
        promise = promise.catch(err => console.error('Error encountered with controller fetching:', err));
        promise = promise.then(values => {
            provider.close();
            return {
                time: date,
                name: c.name,
                data: DatasetHelper_1.DatasetHelper.flatten(values)
            };
        });
        return promise;
    };
});
// At each call, we will run the controller fetching operation and save it to DB every required interval
const fetchFunction = () => {
    // For each controller, store dataset obtained into a buffer
    console.log('[' + new Date().toISOString() + '] fetch');
    controllerFetching.forEach((fetch, index) => {
        fetch()
            .then(dataset => {
            dataset.data.forEach(d => {
                g.set({ unit: d.unit, Batiment: d.label }, d.data);
            });
        })
            .catch(reason => console.error(reason));
    });
};
// Run!
if (config.readFrequency.scheduled) {
    schedule.scheduleJob(config.readFrequency.scheduled, fetchFunction);
}
else {
    fetchFunction();
    setInterval(fetchFunction, config.readFrequency.interval);
}
//expose metrics
server.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
});
console.log('Server listening to 3000, metrics exposed on /metrics endpoint');
server.listen(3000);
