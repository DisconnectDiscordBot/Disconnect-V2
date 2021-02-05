// Variables
const log = require('../utils/logger');
const { Schema, model } = require('mongoose');
const { prefix } = require('../../assets/config.json');

// Cache System
const { Collection } = require('discord.js');
const guildCaches = new Collection();

// Create a schema
const guildSchema = new Schema({
	id: String,
	name: String,
	created: Date,
	tips: { type: Boolean, default: false },
	premium: { type: Boolean, default: false },
	prefix: { type: String, default: prefix },
});

// Create model
module.exports.model = new model('guilds', guildSchema);

// Get a guild
module.exports.get = async (guild) => {
	// Check if there is cached data
	const cached = guildCaches.get(guild.id);

	// Update Guild Name
	if (cached && cached.data.name !== guild.name) {
		cached.data.name = guild.name;
		await cached.data.save();
	}

	// Return cached data if there is any
	if (cached && cached.cacheTime < cached.cacheTime + 1.08e7)
		return cached.data;

	// Get the guild data
	const guildData = await this.model
		.findOne({ id: guild.id })
		.catch((err) => {
			log.database.error(
				`There has been a problem loading guild data. Guild: ${guild.id}, error: ${err}`,
			);
		});

	// Make sure there is data
	if (!guildData) {
		// Create new guild data
		const newGuild = new this.model({
			id: guild.id,
			name: guild.name,
			created: Date.now(),
		});

		// Save and return data
		await newGuild.save();

		// Cache and return data
		guildCaches.set(guild.id, { cacheTime: Date.now(), data: newGuild });
		return newGuild;
	}

	// Cache data
	if (guildData) {
		guildCaches.set(guild.id, { cacheTime: Date.now(), data: guildData });
	}

	// Return Data
	return guildData;
};
