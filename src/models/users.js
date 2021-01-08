// Variables
const { log } = require('../utils/logger');
const { Schema, model } = require('mongoose');

// Cache system
const { Collection } = require('discord.js');
const userCache = new Collection();

// Create a schema
const userSchema = new Schema({
	id: String,
	name: String,
	created: Date,
	premium: { type: Boolean, default: false },
	premium_credits: { type: Number, default: 0 },
	guilds: { type: Array, default: [] },
});

// Create model
module.exports.model = new model('users', userSchema);

// Get a user
module.exports.get = async (user) => {
	// Check if there is cached data
	const cached = userCache.get(user.id);

	// Update usernames
	if (cached && cached.data.name !== user.username) {
		cached.data.name = user.username;
		await cached.data.save();
	}

	// Return Cached data
	if (cached && cached.cacheTime < cached.cacheTime + 1.08e7)
		return cached.data;

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
		userCache.set(user.id, { cacheTime: Date.now(), data: newUser });
		return newUser;
	}

	// Cache and return data
	userCache.set(user.id, { cacheTime: Date.now(), data: userData });
	return userData;
};
