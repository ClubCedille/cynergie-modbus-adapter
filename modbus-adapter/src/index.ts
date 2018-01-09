import * as schedule from 'node-schedule';
import { Configuration } from './Configuration';
import { createControllers } from './helpers/ConfigHelper';
import { DatasetHelper } from './helpers/DatasetHelper';
import { ExtractHelper } from './helpers/ExtractHelper';
import { CsvHelper } from './helpers/CsvHelper';
import { FakeProvider } from './providers/FakeProvider';
import { ModBusProvider } from './providers/ModBusProvider';

const config = require('../config.json') as Configuration;

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


const controllers = createControllers(config.controllers);


const args = process.argv.slice(2);
const debugMode = args.length === 1;
if (debugMode) {
	console.warn('Debug mode enabled!');
}

console.log(`Service started (frq: ${config.readFrequency.interval}ms, occ: ${config.readFrequency.requiredOccurences})!`);

// Declare the functions used to retrieve data from each controllers
const ChosenProvider = debugMode ? FakeProvider : ModBusProvider;
const controllerFetching = controllers.map(c => {
	const provider = new ChosenProvider(c.address, c.port, c.slaveId);
	return () => {
		const date = new Date();
		let promise = provider.connect();
		promise = promise.then(() => []);

		c.readings.forEach(r => {
			promise = promise.then((v: any[]) => provider.read(r.address, r.nbRegisters).then(raw => { v.push(r.recompose(raw.buffer)); return v; }));
		});

		promise = promise.catch(err => console.error('Error encountered with controller fetching:', err));
		promise = promise.then(values => {
			provider.close();
			return {
				time: date,
				name: c.name,
				data: DatasetHelper.flatten(values)
			}
		});

		return promise;
	}
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

console.log('Server listening to 3002, metrics exposed on /metrics endpoint');
server.listen(3002);
