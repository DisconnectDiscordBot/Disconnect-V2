// Variables
const { client } = require('../bot');
const log = require('../utils/logger');

// When the client is logged in
client.on('ready', async () => {
	// Tell us the bot is starting
	log.client.info('Starting up...');

	// Load the database
	require('./database');

	// Load the commands
	const { fetchCommands } = require('./commands');
	await fetchCommands(client);

	// Load the events
	const { fetchEvents } = require('./events');
	await fetchEvents();

	// Tell us the bot has finished loading
	log.client.info(`${client.user.username} is online and ready.`);
});
