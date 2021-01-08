const {
	inviteLink,
	supportInvite,
} = require('../../../assets/config/settings.json');

module.exports.run = async ({ message, client }) => {
	return message.channel.send(
		`**Looking for support?** \nJoin our support server at https://discord.gg/${supportInvite} \n\n**Looking to invite ${client.user.username}?** \nInvite using <${inviteLink}>`,
	);
};

module.exports.config = {
	name: 'invite',
	aliases: ['inv'],
};
