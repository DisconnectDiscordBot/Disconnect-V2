const {
	improperUsage,
	createSuccessEmbed,
	premiumOnly,
} = require('../../utils/embed');
const { MessageEmbed } = require('discord.js');
const palette = require('../../../assets/colors.json');
const config = require('../../../assets/config.json');

module.exports.run = async ({ message, args, guildData }) => {
	const e = new MessageEmbed()
		.setTitle('Farewell Messages')
		.setColor(palette.primary);

	switch (args[0] ? args[0].toLowerCase() : null) {
		case 'enable':
			if (guildData.farewellEnabled) {
				return message.channel.send(
					improperUsage('Farewell is already enabled!'),
				);
			}

			if (!guildData.farewellChannel.length) {
				return message.channel.send(
					improperUsage(
						`Please set a farewell channel before enabling farewell messages. Example ${
							guildData.prefix ? guildData.prefix : config.prefix
						}farewell channel #welcome`,
					),
				);
			}

			guildData.farewellEnabled = true;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Farewell messages has now been **Enabled** in <#${guildData.farewellChannel}>!`,
				),
			);

		case 'disable':
			if (!guildData.farewellEnabled) {
				return message.channel.send(
					improperUsage('Farewell is already disabled!'),
				);
			}

			guildData.farewellEnabled = false;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Farewell messages has now been **Disabled** in <#${guildData.farewellChannel}>!`,
				),
			);

		case 'channel':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						'Please specify the channel you would like to send the welcome messages.',
					),
				);
			}

			const channel =
				message.guild.channels.cache.get(
					args
						.slice(1)
						.join(' ')
						.replace(/>/g, '')
						.replace(/@/g, '')
						.replace(/</g, '')
						.replace(/#/g, ''),
				) ||
				message.guild.channels.cache.find(
					(c) => c.name == args.slice(1).join(' '),
				);
			if (!channel) {
				return message.channel.send(
					improperUsage(
						'I was unable to find the channel you were looking for.',
					),
				);
			}

			// Check permissions
			if (
				!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')
			) {
				return message.channel.send(
					improperUsage(
						'I am unable to send messages in that channel.',
					),
				);
			}
			if (!channel.permissionsFor(message.guild.me).has('ATTACH_FILES')) {
				return message.channel.send(
					improperUsage(
						'I am unable to send images *(or files)* in that channel.',
					),
				);
			}

			guildData.farewellChannel = channel.id;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Farewell channel has now been set to <#${guildData.farewellChannel}>!`,
				),
			);

		case 'format':
			if (!args[1]) {
				return message.channel.send(
					improperUsage(
						'Please specify weather you would like to set the welcome message to be an `image` or `text`.',
					),
				);
			}

			if (args[1].toLowerCase() === 'image') {
				guildData.farewellFormat = 'image';
				await guildData.save();
				return message.channel.send(
					createSuccessEmbed(
						'Farewell messages will now send **images** instead of text on join.',
					),
				);
			} else {
				guildData.farewellFormat = 'text';
				await guildData.save();
				return message.channel.send(
					createSuccessEmbed(
						'Farewell messages will now send **text** instead of an image on join.',
					),
				);
			}

		default:
		case 'help':
			e.setDescription(
				'Hey, I can send off your members for you too!\nIf you would like to setup farewell messages please use one of the following options.\n\n`enable | disable` - Enable or disable farewell messages.\n`channel` - Change the channel farewell messages are being sent to.\n`format` - Change wether farewell is text or an image. (*More customization coming soon!*)',
			).setFooter(
				`I also do welcoming messages, check them out with ${
					guildData.prefix ? guildData.prefix : config.prefix
				}farewell`,
			);

			return message.channel.send(e);
	}
};

module.exports.config = {
	name: 'farewell',
	aliases: ['set-farewell'],
	permissions: ['MANAGE_GUILD'],
};
