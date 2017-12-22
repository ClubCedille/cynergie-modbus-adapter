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
const register = require('../prom-client').register;

//creating gauge pour prometheus metric
const Gauge = require('../prom-client').Gauge;
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


// Initializing buffer
const buffer = [];
controllerFetching.forEach((v, i) => buffer[i] = []);

// At each call, we will run the controller fetching operation and save it to DB every required interval
const fetchFunction = () => {
	// For each controller, store dataset obtained into a buffer
	console.log('[' + new Date().toISOString() + '] fetch');
	controllerFetching.forEach((fetch, index) => {
		fetch()
			.then(dataset => {
				buffer[index] = [dataset, ...buffer[index]];
				if (buffer[index].length % config.readFrequency.requiredOccurences === 0) {
					const summarizedData = DatasetHelper.summarize(buffer[index]);

					// Previously storage

					buffer[index] = [];
				}
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


setInterval(() => {
	g.set({ unit: 'Volt', Batiment: 'A' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'b' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'c' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'd' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'e' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'f' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'o' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'r' },Math.random() );
	g.set({ unit: 'Volt', Batiment: 'n' },Math.random() );
}, 100);

//expose metrics
server.get('/metrics', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(register.metrics());
});

console.log('Server listening to 3000, metrics exposed on /metrics endpoint');
server.listen(3000);
