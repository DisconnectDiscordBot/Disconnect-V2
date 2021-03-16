// Variables
const { fetchFiles } = require('../utils/files');
const log = require('../utils/logger');

// Module
module.exports.fetchEvents = () => {
	// Get the files
	const eventFiles = fetchFiles('./src/events/', '.js');

	// Check if there are files
	if (eventFiles.length <= 0) {
		return log.system.warn('There are no events to load! continuing. . .');
	}

	// Require all files
	for (const event of eventFiles) require(event);

	// Log the events
	return log.system.info(
		`${eventFiles.length} event${
			eventFiles.length > 1 ? 's' : ''
		} have been loaded. . .`,
	);
};
