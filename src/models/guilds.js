// Variables
const { log } = require('../utils/logger');
const { Schema, model } = require('mongoose');
const { prefix } = require('../../assets/config/settings.json');

// Cache System
const { Collection } = require('discord.js');
const guildCaches = new Collection();

// Create a schema
const guildSchema = new Schema({
	id: String,
	name: String,
	created: Date,
	prefix: { type: String, default: prefix },
});

// Create model
module.exports.model = new model('guilds', guildSchema);

// Get a guild
module.exports.get = async (guild) => {
	// Get the guild data
	const guildData = await this.model
		.findOne({ id: guild.id })
		.catch((err) => {
			log.database.error(
				`There has been a problem loading guild data. Guild: ${guild.id}, error: ${err}`
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
		return newGuild;
	}

	// Return Data
	return guildData;
};
