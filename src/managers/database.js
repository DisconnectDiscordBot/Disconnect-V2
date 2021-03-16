// Normal variables
const log = require('../utils/logger');
const { connect } = require('mongoose');
const { DATABASE_LINK: link } = process.env;

// Define the database options
const options = {
	keepAlive: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
};

// Check link and options
if (!link || !options) {
	return null;
}

// Connect
connect(link, options).catch((err) => log.database.error(err));
