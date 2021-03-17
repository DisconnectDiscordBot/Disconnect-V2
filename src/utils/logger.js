// Variables
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { improperUsage } = require('../utils/embed');
const { client: bot } = require('../bot');
const chalk = require('chalk');

// Formats
const logFormat = printf(({ level, timestamp: time, message, label: text }) => {
	if (!message || !message.length) {
		return '';
	}
	return `${time} [${level}] ${text} ${message}`;
});

const consoleFormat = printf(
	({ level, timestamp: time, message, label: text }) => {
		if (!message || !message.length) {
			return '';
		}

		// Makeshift send messages to discord
		if (level === 'error') {
			bot.guilds.cache
				.get('713612836961648680')
				.channels.cache.get('796034828091916329')
				.send(
					improperUsage(`[${text}] [${time}] ${level}: ${message}`),
				);
		}

		// Colors
		if (level === 'warn') {
			return `${chalk.yellow(`[${label}] ${level}: ${message}`)}`;
		}
		if (level === 'error') {
			return `${chalk.red(`[${label}] ${level}: ${message}`)}`;
		}

		// Return non colored messages
		return `[${text}] ${level}: ${message}`;
	},
);

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
