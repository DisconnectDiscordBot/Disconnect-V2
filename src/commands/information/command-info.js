const { MessageEmbed } = require('discord.js');
const { improperUsage } = require('../../utils/embed');
const { primary } = require('../../../assets/config/colors.json');
const { website } = require('../../../assets/config/settings.json');
const { commandInfo } = require('../../../assets/responses/commands.json');
const {
	categories: translate,
} = require('../../../assets/responses/translation.json');

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

	return message.channel.send(
		`__${translate[info.category]} -> ${command.config.name}__ \n${
			info.disc
		} ${info.aliases ? `\n**Aliases**: ${info.aliases}` : ''} ${
			info.usage ? `\n**Usage**: \`${info.usage}\`` : ''
		} ${info.example ? `\n**Example**:\`${info.example}\`` : ''} ${
			info.perms ? `\n**Required Permissions**: ${info.perms}` : ''
		}`,
	);
};

module.exports.config = {
	name: 'command-info',
	aliases: ['command-information', 'command'],
};
