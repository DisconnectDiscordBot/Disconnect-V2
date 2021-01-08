const { MessageEmbed } = require('discord.js');
const { getTimeSince, formatDate } = require('../../tools');

module.exports.run = async ({ message, args }) => {
	let role =
		message.mentions.roles.first() ||
		message.guild.roles.cache.get(args[0]) ||
		message.guild.roles.cache.find(
			(r) => r.name === args.slice(1).join(' '),
		);

	if (!role) {
		role = message.member.roles.cache.sort((r) => r.position).first();
	}

	const e = new MessageEmbed()
		.setAuthor(role.name)
		.setColor(role.hexColor)
		.setDescription(
			`**Color**: ${role.hexColor} \n**Member Count**: ${
				role.members.size
			}\n**Creation Date**: ${formatDate(
				role.createdAt,
			)} (*${getTimeSince(role.createdAt)}*)`,
		)
		.setFooter(role.id);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'role-info',
	aliases: ['r-i'],
};
