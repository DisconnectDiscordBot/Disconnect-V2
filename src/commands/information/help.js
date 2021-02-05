const { MessageEmbed } = require('discord.js');
const {
	prefix,
	website,
	supportInvite,
} = require('../../../assets/config.json');
const { primary } = require('../../../assets/colors.json');

module.exports.run = async ({ client, message, guildData: guild }) => {
	const e = new MessageEmbed()
		.setTitle('Disconnect Help')
		.setColor(primary)
		.setURL(website)
		.setDescription(
			`Hello, I am Disconnect! How may I help you?\nThis servers prefix is: \`${
				guild.prefix ? guild.prefix : prefix
			}\``,
		)
		.addField(
			'Looking for support?',
			`[Click to join](${website}support) or use code \`${supportInvite}\``,
		)
		.addField(
			'Looking for a command list?',
			`[Check out the command list](${website}commands) or use \`${
				guild.prefix ? guild.prefix : prefix
			}commands\``,
		)
		.addField(
			'*Need more information?*',
			`[Check out the Disconnect Docs](${website}docs) or use \`${
				guild.prefix ? guild.prefix : prefix
			}bot-info\``,
		)
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter(
			'Need information on a certain command? Use the command-information command',
		);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'help',
};
