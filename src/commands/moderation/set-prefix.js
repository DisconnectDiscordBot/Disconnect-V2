const { Message } = require('discord.js');
const logger = require('../../utils/logger');
const { createSuccessEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, args, guildData }) => {
	const newPrefix = args[0];
	const oldPrefix = guildData.prefix;

	if (!newPrefix || newPrefix.length > 3) {
		return message.channel.send(
			improperUsage(
				'Please define a prefix that is no greater than 3 characters',
			),
		);
	}

	guildData.prefix = newPrefix;

	try {
		await guildData.save();
	} catch (err) {
		logger.database.error(err);
		return message.channel.send(
			improperUsage(
				'I am sorry but it seems like I am having a hard time saving your new prefix! Please try again later!',
			),
		);
	}

	return message.channel.send(
		createSuccessEmbed(
			`Successfully changed prefix from \` ${oldPrefix} \` to \` ${newPrefix} \``,
		),
	);
};

module.exports.config = {
	name: 'set-prefix',
	aliases: ['change-prefix'],
	permissions: ['MANAGE_GUILD'],
};
