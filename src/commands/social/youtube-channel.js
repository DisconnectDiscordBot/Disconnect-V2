const { formatDate } = require('../../tools');
const { MessageEmbed } = require('discord.js');
const { improperUsage } = require('../../utils/embed');
const { getYouTubeChannel } = require('../../utils/integrations/youtube');

module.exports.run = async ({ args, message }) => {
	if (!args.length) {
		return message.channel.send(
			improperUsage(
				'Please provide the username of the youtube channel you are looking for.',
			),
		);
	}

	// Get YouTube Account
	const results = await getYouTubeChannel(args.join(' '));
	if (results == 'error') {
		return message.channel.send(
			improperUsage(
				'There was an error while searching for the YouTube channel. Please try again later.',
			),
		);
	}
	if (!results) {
		return message.channel.send(
			improperUsage(
				`I did not find any YouTube channels with the name \`${args
					.slice(1)
					.join(' ')}\``,
			),
		);
	}

	// Get content
	const content = results.snippet;

	// Display Results
	const e = new MessageEmbed()
		.setColor('RED')
		.setTitle(content.title)
		.setDescription(content.description)
		.setFooter(
			`${content.channelId} • Channel Created: ${formatDate(
				content.publishedAt,
			)}`,
		)
		.setThumbnail(content.thumbnails.high.url);

	return message.channel.send(e);
};

module.exports.config = {
	name: 'youtube-channel',
	aliases: ['youtube-c', 'y-c'],
};
