const { MessageEmbed } = require('discord.js');
const { fetchMember } = require('../../tools');
const { secondary } = require('../../../assets/colors.json');

module.exports.run = async ({ message, args }) => {
	// Get user
	let member;
	if (args[0]) member = fetchMember(message, args.join(' '));
	if (!member || typeof member !== 'object') member = message.member;

	// Display Avatar
	const e = new MessageEmbed()
		.setTitle(`${member.displayName}'s Avatar`)
		.setImage(
			member.user
				.displayAvatarURL({ dynamic: true })
				.replace('.webp', '.png') + '?size=2048',
		)
		.setColor(
			member.displayHexColor == '#000000'
				? secondary
				: member.displayHexColor,
		);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'avatar',
	aliases: ['profile-picture', 'pfp'],
};
