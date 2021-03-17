// Variables
const { log } = require('../utils/logger');
const { Schema, model } = require('mongoose');

// Create a schema
const linkSchema = new Schema({
	url: String,
	created: Date,
	deleteAfter: Date,
	type: { type: String, default: 'na' },
});

// Model
module.exports.model = new model('links', linkSchema);

// Get links
module.exports.getLinks = async (type) => {
	const data = await this.model.find({ type }).catch((err) => {
		log.database.error(`Error while getting links. ${err}`);
	});

	// Delete old data
	const oldData = data.filter((doc) => doc.deleteAfter < Date.now());
	for (const del of oldData) {
		await del.remove();
	}

	return data.length
		? data
				.filter((doc) => Date.parse(doc.created) + 5.4e6 > Date.now())
				.map((doc) => doc.url)
		: [];
};
