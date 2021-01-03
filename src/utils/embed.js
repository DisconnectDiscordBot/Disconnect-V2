// Variables
const { client } = require('../bot');
const { MessageEmbed } = require('discord.js');
const palette = require('../../assets/config/colors.json');

// Emojis: ❌ ✔️

// Improper Usage Embeds
module.exports.improperUsage = (body) => {
	const e = new MessageEmbed().setColor(palette.error).setDescription(body);
	return e;
};

// Game Embeds
module.exports.createEmbed = ({ author, title, body, image, footer }) => {
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
	if (footer) e.setFooter(footer);

	return e;
};

module.exports.createSuccessEmbed = (body) => {
	const e = new MessageEmbed()
		.setColor(palette.success)
		.setDescription(
			`${client.emojis.cache.get('795353967852519434')} ${body}`,
		);
	return e;
};
