// Variables
const { Collection } = require('discord.js');
const { fetchFiles } = require('../utils/files');
const log = require('../utils/logger');

// Setup commands
module.exports.fetchCommands = async (client) => {
	// Setup client variables
	client.categories = new Collection();
	client.commands = new Collection();
	client.aliases = new Collection();

	// Getting commands
	const commandFiles = await fetchFiles('./src/commands', '.js');

	// Check the command files
	if (commandFiles == null) return;
	if (commandFiles.length <= 0) {
		return log.system.warn(
			'There are no commands to load! continuing. . .',
		);
	}

	// Load the commands
	for (const path of commandFiles) {
		// Get the file
		const file = require(path);

		// Check the command
		if (!file || !file.config || !file.run) continue;

		// Destructuring the config
		const { name, aliases, category } = file.config;

		// Check the config
		if (!name) continue;

		// Set commands
		client.commands.set(name, file);
		if (name.includes('-')) {
			client.aliases.set(name.replace(/-/g, ''), file);
		}

		if (aliases) {
			// If there are multiple aliases in an array
			if (typeof aliases == 'object') {
				for (const alias of aliases) {
					client.aliases.set(alias, file);
					if (alias.includes('-')) {
						client.aliases.set(alias.replace(/-/g, ''), file);
					}
				}
			}
			// If it is a single alias in a string
			if (typeof aliases == 'string') {
				client.aliases.set(aliases, file);
				if (aliases.includes('-')) {
					client.aliases.set(aliases.replace(/-/g, ''), file);
				}
			}
		}

		// Store the category
		if (category) {
			client.categories.set(name, category);
		}
	}

	// Alert us when the commands have finished loading
	log.system.info(
		`${client.commands.size} command${
			client.commands.size > 1 ? 's' : ''
		} have been loaded. . .`,
	);

	// Alert us when all the aliases have finished loading
	if (client.aliases.size > 0) {
		return log.system.info(
			`${client.aliases.size} alias${
				client.aliases.size > 1 ? 'es' : ''
			} have been loaded. . .`,
		);
	} else {
		return null;
	}
};
