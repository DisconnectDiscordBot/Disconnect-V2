const { MessageEmbed } = require('discord.js');
const { improperUsage } = require('../../utils/embed');
const { primary } = require('../../../assets/colors.json');
const { website } = require('../../../assets/config.json');
const { commandInfo } = require('../../../assets/commands.json');
const { categories: translate } = require('../../../assets/translation.json');

module.exports.run = async ({ client, message, guildData: guild, args }) => {
	// Get Command
	if (!args[0]) {
		return message.channel.send(
			improperUsage(
				'Please provide a command you would like info on. Example `command-info help`',
			),
		);
	}

	const command =
		client.commands.get(args[0].toLowerCase()) ||
		client.aliases.get(args[0].toLowerCase());

	if (!command || !commandInfo[command.config.name.toLowerCase()]) {
		return message.channel.send(
			improperUsage(
				'No command has been found! Please use the `commands` command if you need a command list.',
			),
		);
	}

	const info = commandInfo[command.config.name.toLowerCase()];

	// Send message
	if (info.isNSFW && !message.channel.nsfw) {
		return message.channel.send(
			improperUsage(
				'Please get information on this command in a NSFW channel.',
			),
		);
	}

	const e = new MessageEmbed()
		.setTitle(`${translate[info.category]} -> ${command.config.name}`)
		.setColor(primary);

	if (info.disc) e.setDescription(info.disc);
	if (info.aliases) e.addField('Aliases', info.aliases, true);
	if (info.usage) e.addField('Usage', info.usage, true);
	if (info.example) e.addField('Example', info.example, true);
	if (info.perms) e.addField('Required Permissions', info.perms, true);

	return message.channel.send(e);
};

module.exports.config = {
	name: 'command-info',
	aliases: ['command-information', 'command'],
};
