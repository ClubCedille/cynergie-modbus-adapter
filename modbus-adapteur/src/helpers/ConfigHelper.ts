import { Controller, ControllerConfiguration } from '../model/Controller';
import { Register, RegisterConfiguration } from '../model/Register';

/**
 * Returns a controller list from the controllers configuration structure
 * @param {any} configuration 
 * @returns {Controller[]} 
 */
export function createControllers(configuration: ControllerConfiguration[]): Controller[] {
	return configuration.map(c => {
		const controller = new Controller(c);
		c.registers.forEach(r => {
			const register = new Register(r);
			controller.addRegister(register);
		});
		controller.generateReadings();
		return controller;
	});
}
