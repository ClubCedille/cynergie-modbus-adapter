import { ControllerConfiguration } from './model/Controller';

/** Read frequency configuration as it should appear in JSON configuration */
export interface ReadFrequencyConfiguration {
	scheduled?: boolean | string;
	interval?: number;
	requiredOccurences?: number;
}

/** Main configuration as it should appear in JSON configuration */
export interface Configuration {
	inMemoryDB?: boolean;
	interventionTime?: string;
	readFrequency?: ReadFrequencyConfiguration;
	controllers?: ControllerConfiguration[];
}
