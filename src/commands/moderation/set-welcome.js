const { improperUsage, createSuccessEmbed } = require('../../utils/embed');
const { MessageEmbed } = require('discord.js');
const palette = require('../../../assets/colors.json');
const config = require('../../../assets/config.json');

module.exports.run = async ({ message, args, guildData }) => {
	const e = new MessageEmbed()
		.setTitle('Welcome Messages')
		.setColor(palette.primary);

	switch (args[0] ? args[0].toLowerCase() : null) {
		case 'enable':
			if (guildData.welcomingEnabled) {
				return message.channel.send(
					improperUsage('Welcoming is already enabled!'),
				);
			}

			if (!guildData.welcomingChannel.length) {
				return message.channel.send(
					improperUsage(
						`Please set a welcoming channel before enabling welcomer. Example ${
							guildData.prefix ? guildData.prefix : config.prefix
						}welcomer channel #welcome`,
					),
				);
			}

			guildData.welcomingEnabled = true;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Welcomer has now been **Enabled** in <#${guildData.welcomingChannel}>!`,
				),
			);

		case 'disable':
			if (!guildData.welcomingEnabled) {
				return message.channel.send(
					improperUsage('Welcoming is already disabled!'),
				);
			}

			guildData.welcomingEnabled = false;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Welcomer has now been **Disabled** in <#${guildData.welcomingChannel}>!`,
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

			guildData.welcomingChannel = channel.id;
			await guildData.save();
			return message.channel.send(
				createSuccessEmbed(
					`Welcomer channel has now been set to <#${guildData.welcomingChannel}>!`,
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
				guildData.welcomingFormat = 'image';
				await guildData.save();
				return message.channel.send(
					createSuccessEmbed(
						'Welcomer will now send **images** instead of text on join.',
					),
				);
			} else {
				guildData.welcomingFormat = 'text';
				await guildData.save();
				return message.channel.send(
					createSuccessEmbed(
						'Welcomer will now send **text** instead of an image on join.',
					),
				);
			}

		default:
		case 'help':
			e.setDescription(
				'Hey, I can welcome your members for you too!\nIf you would like to setup welcoming please use one of the following options.\n\n`enable | disable` - Enable or disable welcoming.\n`channel` - Change the welcoming channel messages are sent to.\n`format` - Change wether welcoming is text or an image. (*More customization coming soon!*)',
			).setFooter(
				`I also do farewell messages, check them out with ${
					guildData.prefix ? guildData.prefix : config.prefix
				}farewell`,
			);

			return message.channel.send(e);
	}
};

module.exports.config = {
	name: 'welcomer',
	aliases: [
		'set-welcoming',
		'set-welcome',
		'welcoming',
		'welcome',
		'set-welcomer',
	],
	permissions: ['MANAGE_GUILD'],
};
