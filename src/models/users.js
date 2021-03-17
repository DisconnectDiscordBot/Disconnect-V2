// Variables
const { log } = require('../utils/logger');
const { Schema, model } = require('mongoose');

// Create a schema
const userSchema = new Schema({
	id: String,
	name: String,
	created: Date,
	premium: { type: Boolean, default: false },
	premiumCredits: { type: Number, default: 0 },
	guilds: { type: Array, default: [] },
});

// Create model
module.exports.model = new model('users', userSchema);

// Get a user
module.exports.get = async (user) => {
	// Get the data
	const userData = await this.model.findOne({ id: user.id }).catch((err) => {
		log.database.error(
			`There has been a problem loading user data. User: ${user.id}, error: ${err}`,
		);
	});

	// Make sure there is data
	if (!userData) {
		// Create new data
		const newUser = new this.model({
			id: user.id,
			name: user.username,
			created: Date.now(),
		});

		// Save and return data
		await newUser.save();

		// Cache and return data
		return newUser;
	}

	// Cache and return data
	return userData;
};
