// Variables
const log = require('../utils/logger');
const { Schema, model } = require('mongoose');
const { prefix } = require('../../assets/config.json');

// Create a schema
const guildSchema = new Schema({
	id: String,
	name: String,
	created: Date,
	tips: { type: Boolean, default: false },
	premium: { type: Boolean, default: false },
	prefix: { type: String, default: prefix },
	welcomingEnabled: { type: Boolean, default: false },
	welcomingChannel: { type: String, default: '' },
	welcomingFormat: { type: String, default: 'text' },
	farewellEnabled: { type: Boolean, default: false },
	farewellChannel: { type: String, default: '' },
	farewellFormat: { type: String, default: 'text' },
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
		return newGuild;
	}

	// Return Data
	return guildData;
};
