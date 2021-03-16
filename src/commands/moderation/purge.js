const logger = require('../../utils/logger');
const { createSuccessEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	const limit = parseInt(args[0]);
	if (!limit || isNaN(limit) || limit > 100 || limit < 2) {
		return message.channel.send(
			improperUsage(
				'Please specify the amount you would like to delete. Amount must be between 2 and 100.',
			),
		);
	}

	await message.delete();
	const messages = await message.channel.messages.fetch({ limit });
	let deleted;

	try {
		deleted = await message.channel.bulkDelete(messages);
	} catch (err) {
		if (err.toString().includes('14 days old')) {
			return message.channel.send(
				improperUsage(
					'I am unable to delete messages over 14 days old! Sorry for the inconvenience.',
				),
			);
		} else {
			logger.client.error(err);
		}
	}

	if (deleted < 2) {
		return message.channel.send(
			improperUsage('It seems I have not deleted any messages.'),
		);
	}

	return message.channel.send(
		!deleted || !deleted.size || deleted.size < 2
			? improperUsage('It seems I have not deleted an messages')
			: createSuccessEmbed(
					`Successfully deleted **${deleted.size}** messages!`,
			  ),
	);
};

module.exports.config = {
	name: 'purge',
	permissions: ['MANAGE_MESSAGES'],
	clientPerms: ['MANAGE_MESSAGES'],
	aliases: ['clear', 'bulk-delete'],
};
