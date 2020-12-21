// Variables
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const chalk = require('chalk');

// Formats
const logFormat = printf(({ level, timestamp, message, label }) => {
	if (!message || !message.length) return '';
	return `${timestamp} [${label}] ${level} ${message}`;
});
const consoleFormat = printf(({ level, timestamp, message, label }) => {
	if (!message || !message.length) return '';

	// Colors
	if (level === 'warn')
		return `${chalk.yellow(`[${label}] ${level}: ${message}`)}`;
	if (level === 'error')
		return `${chalk.red(`[${label}] ${level}: ${message}`)}`;

	// Return non colored messages
	return `[${label}] ${level}: ${message}`;
});

// Logger
const client = createLogger({
	format: combine(label({ label: 'CLIENT' }), timestamp(), logFormat),
	transports: [
		new transports.File({
			filename: './logs/errors.log',
			level: 'error',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/warnings.log',
			level: 'warn',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/main.log',
			format: combine(logFormat),
		}),
		new transports.Console({
			format: combine(consoleFormat),
		}),
	],
});
const database = createLogger({
	format: combine(label({ label: 'DATABASE' }), timestamp(), logFormat),
	transports: [
		new transports.File({
			filename: './logs/errors.log',
			level: 'error',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/warnings.log',
			level: 'warn',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/main.log',
			format: combine(logFormat),
		}),
		new transports.Console({
			format: combine(consoleFormat),
		}),
	],
});
const system = createLogger({
	format: combine(label({ label: 'SYSTEM' }), timestamp(), logFormat),
	transports: [
		new transports.File({
			filename: './logs/errors.log',
			level: 'error',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/warnings.log',
			level: 'warn',
			format: combine(logFormat),
		}),
		new transports.File({
			filename: './logs/main.log',
			format: combine(logFormat),
		}),
		new transports.Console({
			format: combine(consoleFormat),
		}),
	],
});

const logger = {
	client,
	database,
	system,
};

// Exports
module.exports = logger;
