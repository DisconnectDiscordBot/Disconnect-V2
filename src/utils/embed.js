// Variables
const { client } = require('../bot');
const { MessageEmbed } = require('discord.js');
const palette = require('../../assets/colors.json');

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

// Success Embed
module.exports.createSuccessEmbed = (body) => {
	const e = new MessageEmbed()
		.setColor(palette.success)
		.setDescription(
			`${client.emojis.cache.get('816080871110082560')} ${body}`,
		);
	return e;
};

// Missing Permissions
module.exports.missingPermissions = (type, perms) => {
	const e = new MessageEmbed()
		.setColor(palette.error)
		.setTitle(`${type} missing the following permissions`)
		.setDescription(`• ${perms.join('\n• ')}`);
	return e;
};

// Premium Only Commands
module.exports.premiumOnly = (command, type) => {
	const e = new MessageEmbed()
		.setColor(palette.primary)
		.setTitle(
			type == 'limited'
				? 'This Command Is Limited'
				: 'This Command is Premium Only',
		)
		.setDescription(`hi`)
		.setFooter("I'm sorry!!!");
	return e;
};
