// Variables
const { client } = require('../bot');
const { Collection, MessageEmbed } = require('discord.js');
const palette = require('../../assets/config/colors.json');
const check_mark = client.emojis.cache.get('');

// Success Embeds
module.exports.success = (res) => {
	const successEmbed = new MessageEmbed().setTitle(`${check_mark} Success`);
};

// Error Embeds
module.exports.improperUsage = (message) => {
	const e = new MessageEmbed()
		.setColor(palette.error)
		.setDescription(message);
	return e;
};

// Game Embeds
module.exports.createEmbed = async ({ author, title, body, image }) => {
	const e = new MessageEmbed().setColor(palette.secondary);

	if (author) {
		if (author.username)
			e.setAuthor(
				author.username,
				author.avatarURL ? author.avatarURL : avatar.displayAvatarURL(),
			);
		else e.setAuthor(author);
	}
	if (title) e.setTitle(title);
	if (body) e.setDescription(body);
	if (image) e.setImage(image);

	return e;
};
