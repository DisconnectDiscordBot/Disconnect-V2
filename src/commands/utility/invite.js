const { MessageEmbed } = require('discord.js');
const { primary } = require('../../../assets/colors.json');
const { website } = require('../../../assets/config.json');

module.exports.run = async ({ message, client }) => {
	const e = new MessageEmbed()
		.setTitle('Disconnect Invites')
		.setColor(primary)
		.addField(
			'Looking for support?',
			`[Join the Disconnect Support Server](${website}support)`,
		)
		.addField(
			'Looking to invite Disconnect?',
			`[Invite Disconnect](${website}invite)`,
		);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'invite',
	aliases: ['inv'],
};
