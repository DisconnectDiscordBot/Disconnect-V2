// Variables
const log = require('../../utils/logger');
const { connection } = require('mongoose');

// Event
connection.once('open', () => {
	return log.database.info('Database has been connected!');
});
