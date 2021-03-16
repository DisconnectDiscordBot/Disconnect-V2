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
		if (author.username) {
			e.setAuthor(
				author.username,
				author.avatarURL
					? author.avatarURL
					: author.avatar.displayAvatarURL(),
			);
		} else {
			e.setAuthor(author);
		}
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
			type === 'limited' ? 'Limited Command' : 'Premium Command Only',
		)
		.setDescription(
			`Hello, the \`${command}\` command is a ${
				type === 'limited' ? 'limited' : 'premium'
			} command. This is usually done to give you a taste of the command is limited, like a free trial. As this free to use, all fee's and expenses are from the developers pocket. The commands restricted usually relate to expenses and we ask if you could help support Disconnect over on our [patreon here](https://disconnectbot.com/premium). These donations mean a lot and go straight back into the development and continuation of Disconnect. \n\nAlready a premium Disconnect user? Head over to our support server [here](https://disconnectbot.com/support) to get your perks. *(Automation of this process is in development, but currently not out.)*`,
		)
		.setFooter('I am sorry');
	return e;
};
