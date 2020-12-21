// Normal variables
const { connect } = require('mongoose');
const { DATABASE_LINK: link } = process.env;

// Define the database options
const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
};

// Check link and options
if (!link || !options) return null;

// Connect
connect(link, options).catch((err) => console.log(err));
