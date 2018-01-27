"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("../model/Controller");
const Register_1 = require("../model/Register");
/**
 * Returns a controller list from the controllers configuration structure
 * @param {any} configuration
 * @returns {Controller[]}
 */
function createControllers(configuration) {
    return configuration.map(c => {
        const controller = new Controller_1.Controller(c);
        c.registers.forEach(r => {
            const register = new Register_1.Register(r);
            controller.addRegister(register);
        });
        controller.generateReadings();
        return controller;
    });
}
exports.createControllers = createControllers;
