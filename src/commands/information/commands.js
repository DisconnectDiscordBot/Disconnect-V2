const { MessageEmbed } = require('discord.js');
const { website } = require('../../../assets/config.json');
const { version } = require('../../../package.json');
const { primary } = require('../../../assets/colors.json');
const changelog = require('../../../assets/changelog.json');
const { commands } = require('../../../assets/commands.json');
const { categories: translate } = require('../../../assets/translation.json');

module.exports.run = async ({ client, message }) => {
	// Send message
	const e = new MessageEmbed()
		.setTitle('Disconnect Command List')
		.setURL(`${website}commands`)
		.setColor(primary)
		.setDescription(
			`Version ${version} - **${changelog[version].title}** \n\`${client.commands.size}\` commands found and \`${client.aliases.size}\` aliases found.`,
		);

	// Set up categories
	for (const category of Object.keys(commands)) {
		if (category === 'nsfw' && message.channel.nsfw == false) continue;
		const commandsFound = commands[category];
		e.addField(
			translate[category],
			`\`${commandsFound.join('`, `')}\``,
		).setFooter(
			'Need information on a certain command? Use the command-information command',
		);
	}

	// Send Message
	return message.channel.send(e);
};

module.exports.config = {
	name: 'commands',
	aliases: 'command-list',
};
