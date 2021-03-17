const { MessageEmbed } = require('discord.js');
const { secondary } = require('../../../assets/colors.json');
const { getTimeSince, formatDate } = require('../../tools');
const { regions } = require('../../../assets/translation.json');

module.exports.run = async ({ client, message }) => {
	const textChannels = [];
	const voiceChannels = [];
	const categories = [];
	for (const channel of message.guild.channels.cache) {
		if (channel[1].type === 'text') textChannels.push(channel);
		if (channel[1].type === 'voice') voiceChannels.push(channel);
		if (channel[1].type === 'category') categories.push(channel);
	}

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
			`**${client.emojis.cache.get('816080871261995008')} ${
				categories.length
			} \n${client.emojis.cache.get('816080871081508955')} ${
				textChannels.length
			} \n${client.emojis.cache.get('816080871005880341')} ${
				voiceChannels.length
			} \n **ALL: **${message.guild.channels.cache.size}**`,
			true,
		)
		.addField('Members', `Total **${message.guild.memberCount}**`, true)
		.addField(
			'Misc.',
			`Roles **${message.guild.roles.cache.size}**\nEmojis **${message.guild.emojis.cache.size}**`,
			true,
		)
		.setFooter(message.guild.id);

	if (message.guild.banner) {
		e.setImage(`${message.guild.bannerURL()}`);
	}
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
