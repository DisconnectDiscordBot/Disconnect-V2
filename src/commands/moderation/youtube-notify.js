const {
	improperUsage,
	createSuccessEmbed,
	premiumOnly,
} = require('../../utils/embed');
const agent = require('superagent');
const {
	checkChannels,
	model: createNotif,
} = require('../../models/notifications');
const log = require('../../utils/logger');
const { MessageEmbed } = require('discord.js');
const config = require('../../../assets/config.json');

async function searchChannel(message, search) {
	const channel = await agent
		.get(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${process.env.YOUTUBE_KEY}&maxResults=1&type=channel`,
		)
		.catch((err) => {
			message.channel.send(
				improperUsage(
					'I could not find the channel your were looking for... Please try again later.',
				),
			);
			log.client.error(
				`-youtube-notification add- There was an error while looking for a channel \`${search}\`. YouTube Error: \`${err}\``,
			);
			return null;
		});

	if (!channel || !channel.body.items[0]) {
		message.channel.send(
			improperUsage(
				`I was unable to find a channel with the search: ${search}`,
			),
		);
		return null;
	}

	return channel;
}

module.exports.run = async ({ message, args, guildData }) => {
	const rawChannels = await checkChannels('youtube', message.guild.id, null);
	const rawChannelIds = rawChannels.map((item) => item._doc.uuid);

	const e = new MessageEmbed()
		.setTitle('YouTube Notifications')
		.setColor('FF0000')
		.setThumbnail('https://i.imgur.com/F1ikCwh.png');

	switch (args[0] ? args[0].toLowerCase() : null) {
		case 'list':
			const channels = [];

			// Get data
			for (const channel of rawChannels) {
				const data = await agent.get(
					`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channel._doc.uuid}&key=${process.env.YOUTUBE_KEY}&maxResults=1&type=channel`,
				);

				if (data.body.items[0]) {
					channels.push(
						`[${data.body.items[0].snippet.title}](https://www.youtube.com/channel/${data.body.items[0].snippet.channelId})`,
					);
				} else {
					channels.push('There was an error finding this channel.');
				}
			}

			// Setup Description
			const desc = channels.map((c, i) => {
				return `${i + 1}: **${c}** in <#${
					rawChannels[i]._doc.channelID
				}>`;
			});

			e.setDescription(
				`${
					desc.length
						? 'Uploads from these creators will be notified in the following channel.\n'
						: `For youtube notifications, subscribe to a channel using the \`${
								guildData ? guildData.prefix : config.prefix
						  }youtube-notification add <channel name>\`\n`
				}${desc.join('\n')}`,
			);

			return message.channel.send(e);

		case 'add':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						`What channel would you like me to notify you about. Examples below: \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}youtube-notification add Cytech\` \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}youtube-notification add UCZBdr8rBKms3559TAyhBRXw\``,
					),
				);
			}

			// Get Channel
			const channel = await searchChannel(
				message,
				args.slice(1).join(' '),
			);
			if (channel == null) return;

			// Channel information
			const channelInfo = channel.body.items[0].snippet;
			const channelId = channelInfo.channelId;

			// Make sure that the guild is not already looking at the channel
			if (rawChannelIds.includes(channelId)) {
				return message.channel.send(
					improperUsage(
						`I am already watching for uploads by **${
							channelInfo.channelTitle
						}** in channel <#${
							rawChannels[rawChannelIds.indexOf(channelId)]._doc
								.channelID
						}>`,
					),
				);
			}

			// Check if the guild is premium
			if (!guildData.premium && rawChannels.length >= 3) {
				return message.channel.send(premiumOnly());
			}

			// Add the channel to the database
			const newNotif = new createNotif({
				uuid: channelId,
				guildID: message.guild.id,
				created: Date.now(),
				channelID: message.channel.id,
				type: 'youtube',
			});

			await newNotif.save().catch((err) => {
				log.database.error(
					`There was an error saving a new youtube channel. Error ${err}`,
				);
				return message.channel.send(
					improperUsage(
						'I had a hard time subscribing to the channel... Please try again later.',
					),
				);
			});

			return message.channel.send(
				createSuccessEmbed(
					`I have subscribed to **${channelInfo.channelTitle}**. I will now upload all uploads by them here!`,
				),
			);

		case 'remove':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						`What channel would you like me to stop notifying you about. Examples below: \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}youtube-notification remove Cytech\` \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}youtube-notification remove UCZBdr8rBKms3559TAyhBRXw\``,
					),
				);
			}

			args.shift();
			const removeChannel = await searchChannel(message, args.join(' '));

			// Channel information
			const removeChannelInfo = removeChannel.body.items[0].snippet;
			const removeChannelId = removeChannelInfo.channelId;

			// Make sure that the guild is not already looking at the channel
			if (!rawChannelIds.includes(removeChannelId)) {
				return message.channel.send(
					improperUsage(
						`I am not watching for uploads by **${removeChannelInfo.channelTitle}** yet.`,
					),
				);
			}

			for (const creator of rawChannels) {
				if (creator._doc.uuid == removeChannelId) {
					await creator.remove();
				}
			}

			return message.channel.send(
				createSuccessEmbed(
					`I will no longer notify about uploads from **${removeChannelInfo.channelTitle}**`,
				),
			);

		default:
		case 'help':
			e.setDescription(
				'How may I assist you with YouTube Notifications? \nPlease use one of the following options below. \n\n`list` - Check all current YouTube connections. \n`add <channel name>` - Subscribe to a channels notification list. \n`remove <channel name or id>` - Unsubscribe from channels notification list.',
			);

			return message.channel.send(e);
	}
};

module.exports.config = {
	name: 'youtube-notification',
	aliases: ['youtube-nofity', 'yt-notify'],
	permissions: ['MANAGE_GUILD'],
};
