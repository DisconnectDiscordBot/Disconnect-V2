const { MessageEmbed } = require('discord.js');
const { secondary } = require('../../../assets/colors.json');
const { getTimeSince, formatDate } = require('../../tools');
const { regions } = require('../../../assets/translation.json');

module.exports.run = async ({ client, message }) => {
	const e = new MessageEmbed()
		.setColor(secondary)
		.setTitle(message.guild.name)
		.setThumbnail(message.guild.iconURL({ format: 'png' }))
		.setDescription(
			`${
				message.guild.description
					? `${message.guild.description}\n`
					: ''
			} **Owner**: ${message.guild.owner} \n**Region**: ${
				regions[message.guild.region]
			}\n**Guild Created**: ${formatDate(
				message.guild.createdAt,
			)} (*${getTimeSince(message.guild.createdAt)}*)`,
		)
		.addField(
			'Channels',
			`**${client.emojis.cache.get(
				'795140464541302794',
			)} 12\n${client.emojis.cache.get(
				'795139520680165396',
			)} 64 \n${client.emojis.cache.get('795139520307003424')} 19**`,
			true,
		)
		.addField(
			'Members',
			`Total **${message.guild.memberCount}\n${client.emojis.cache.get(
				'795142867843809291',
			)} ${message.guild.members.cache
				.filter((member) => !member.user.bot)
				.size.toLocaleString()}\n${client.emojis.cache.get(
				'795142867974488074',
			)} ${message.guild.members.cache
				.filter((member) => member.user.bot)
				.size.toLocaleString()}**`,
			true,
		)
		.addField(
			'Misc.',
			`Roles **${message.guild.roles.cache.size}**\nEmojis **${message.guild.emojis.cache.size}**`,
			true,
		)
		.setFooter(message.guild.id);

	if (message.guild.banner) e.setImage(`${message.guild.bannerURL()}`);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'guild-info',
	aliases: [
		'guild-information',
		'server-info',
		'server-information',
		's-i',
		'g-i',
	],
};
