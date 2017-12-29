import { expect } from 'chai';
import { Register } from '../../src/model/Register';
import { Controller, ControllerConfiguration } from '../../src/model/Controller';

describe('model.Controller', () => {
	const configuration: ControllerConfiguration = {
		address: 'address',
		name: 'name',
		port: 502,
		registers: null,
		slaveId: 0
	};

	describe('new', () => {
		it('Should contains all configuration values expect registers at instanciation', () => {
			// Arrange && Act
			const controller = new Controller(configuration);

			// Assert
			expect(controller.address).to.equal(configuration.address);
			expect(controller.name).to.equal(configuration.name);
			expect(controller.port).to.equal(configuration.port);
			expect(controller.registers).to.deep.equal([]);
			expect(controller.slaveId).to.equal(configuration.slaveId);
		});

		it('Should instance has to be read to read at instance time', () => {
			// Arrange && Act
			const controller = new Controller(configuration);

			// Assert
			expect(controller.readingsReady).to.be.true;
		});
	});

	describe('addRegister', () => {
		const register = new Register({label: 'label', address: 0, type: 'INT32', unit: 'T', coefficient: -1});

		it('Should add a new register', () => {
			// Arrange
			const controller = new Controller(configuration);

			// Act
			controller.addRegister(register);

			// Assert
			expect(controller.registers).to.contain(register);
			expect(controller.registers).to.have.lengthOf(1);
		});

		it('Should always made the controller not ready for read operation', () => {
			// Arrange
			const controller = new Controller(configuration);

			// Act
			controller.addRegister(register);

			// Assert
			expect(controller.readingsReady).to.be.false;
		});

		it('Should not add a register twice', () => {
			// Arrange
			const controller = new Controller(configuration);
			controller.addRegister(register);

			// Act && Assert
			expect(() => controller.addRegister(register)).to.throw;
			expect(controller.registers).to.have.lengthOf(1);
			expect(controller.registers).to.contain(register);
		});
	});

	describe('generateReadings', () => {
		it('Should', () => {
			// Arrange
			// Act
			// Assert
		});
	});
});
