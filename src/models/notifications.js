/* YouTube, Twitch, Twitter, and Reddit */
// Variables
const { log } = require('../utils/logger');
const { Schema, model } = require('mongoose');

// Create a schema
const channelSchema = new Schema({
	uuid: String,
	guildID: String,
	channelID: String,
	created: Date,
	screenName: String,
	type: { type: String, default: 'na' },
});

// Model
module.exports.model = new model('channels', channelSchema);

// Get links
module.exports.getNotifications = async (type) => {
	const data = await this.model.find({ type }).catch((err) => {
		log.database.error(`Error while searching for channels. ${err}`);
	});
	return data.length ? data : [];
};

// Get all channel connections
module.exports.checkChannels = async (type, guildID, channelID) => {
	const data = channelID
		? await this.model
				.findOne({ type, guildID, uid: channelID })
				.catch((err) => {
					log.database.error(`Error while checking channels: ${err}`);
				})
		: await this.model.find({ type, guildID }).catch((err) => {
				log.database.error(`Error while checking channels: ${err}`);
		  });
	return data ? data : null;
};

// Get all notifications based on UUID
module.exports.getUUID = async (type, uuid) => {
	const data = await this.model.find({ type, uuid }).catch((err) => {
		log.database.error(`Error while searching for uuid channels. ${err}`);
	});
	return data.length ? data : [];
};
