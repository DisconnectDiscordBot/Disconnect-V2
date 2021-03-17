const log = require('../../utils/logger');
const {
	improperUsage,
	createSuccessEmbed,
	premiumOnly,
} = require('../../utils/embed');
const {
	checkChannels,
	model: CreateNotif,
} = require('../../models/notifications');
const { MessageEmbed } = require('discord.js');
const config = require('../../../assets/config.json');
const { getTwitterUser } = require('../../utils/integrations/twitter');

module.exports.run = async ({ message, args, guildData }) => {
	const rawChannels = await checkChannels('twitter', message.guild.id, null);
	const rawChannelIds = rawChannels.map((item) => item._doc.uuid);

	const e = new MessageEmbed()
		.setTitle('Twitter Notifications')
		.setColor('00ACEE')
		.setThumbnail('https://i.imgur.com/bFmWF7s.png');

	switch (args[0] ? args[0].toLowerCase() : null) {
		case 'list':
			const channels = [];

			// Get data
			for (const channel of rawChannels) {
				const result = await getTwitterUser(channel._doc.screenName);

				if (result && result !== 'error') {
					channels.push(`${result.name} (@${result.screen_name})`);
				} else {
					channels.push('There was an error finding this account.');
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
						? 'Tweets from these accounts will be notified in the following channel.\n'
						: `For Twitter tweet notifications, subscribe to a channel using the \`${
								guildData ? guildData.prefix : config.prefix
						  }twitter-notification add <@screen name>\`\n`
				}${desc.join('\n')}`,
			);

			return message.channel.send(e);

		case 'add':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						`What @Twitter account would you like me to notify you about? Examples below: \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}twitter-notification add DevCytech\``,
					),
				);
			}

			// Get Channel
			const account = await getTwitterUser(args[1]);
			if (account === 'error') {
				return message.channel.send(
					improperUsage(
						'There was an error while searching for the Twitter account. Please try again later.',
					),
				);
			}
			if (!account) {
				return message.channel.send(
					improperUsage(
						`I did not find any Twitter accounts with the screen name \`${args[1]}\``,
					),
				);
			}

			// Make sure that the guild is not already looking at the channel
			if (rawChannelIds.includes(account.id_str)) {
				return message.channel.send(
					improperUsage(
						`I am already watching for tweets by **${
							account.name
						} (@${account.screen_name})** in channel <#${
							rawChannels[rawChannelIds.indexOf(account.id_str)]
								._doc.channelID
						}>`,
					),
				);
			}

			// Check if the guild is premium
			if (!guildData.premium && rawChannels.length >= 3) {
				return message.channel.send(premiumOnly());
			}

			// Add the channel to the database
			const newNotif = new CreateNotif({
				uuid: account.id_str,
				guildID: message.guild.id,
				created: Date.now(),
				channelID: message.channel.id,
				type: 'twitter',
				screenName: account.screen_name,
			});

			await newNotif.save().catch((err) => {
				log.database.error(
					`There was an error saving a new twitter account. Error ${err}`,
				);
				return message.channel.send(
					improperUsage(
						'I had a hard time following the account... Please try again later.',
					),
				);
			});

			return message.channel.send(
				createSuccessEmbed(
					`I have followed **${account.name} (@${account.screen_name})**. I will now upload all tweets by them here!`,
				),
			);

		case 'remove':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						`What @Twitter account would you like me to stop notifying you about? Examples below: \n\`${
							guildData.prefix ? guildData.prefix : config.prefix
						}twitter-notification remove DevCytech\``,
					),
				);
			}

			const removeAccount = await getTwitterUser(args[1]);

			// Check channel
			if (removeAccount === 'error') {
				return message.channel.send(
					improperUsage(
						'There was an error while searching for the Twitter account. Please try again later.',
					),
				);
			}
			if (!removeAccount) {
				return message.channel.send(
					improperUsage(
						`I did not find any Twitter channels with the name \`${args[1]}\``,
					),
				);
			}

			// Make sure that the guild is not already looking at the channel
			if (!rawChannelIds.includes(removeAccount.id_str)) {
				return message.channel.send(
					improperUsage(
						`I am not watching for tweets by **${removeAccount.name} (@${removeAccount.screen_name})** yet.`,
					),
				);
			}

			for (const twitterAccount of rawChannels) {
				if (twitterAccount._doc.uuid === removeAccount.id_str) {
					await twitterAccount.remove();
				}
			}

			return message.channel.send(
				createSuccessEmbed(
					`I will no longer notify about tweets from **${removeAccount.name} (@${removeAccount.screen_name})**`,
				),
			);

		default:
		case 'help':
			e.setDescription(
				'How may I assist you with Twitter Notifications? \nPlease use one of the following options below. \n\n`list` - Check following accounts. \n`add <twitter @screen name>` - Follow their twitter account for notifications \n`remove <twitter @screen name>` - Remove their twitter account form notifications',
			);

			return message.channel.send(e);
	}
};

module.exports.config = {
	name: 'twitter-notification',
	aliases: ['twitter-notify', 'twit-notify'],
	permissions: ['MANAGE_GUILD'],
};
