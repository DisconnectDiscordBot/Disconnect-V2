const { MessageEmbed } = require('discord.js');
const { formatTimeSince } = require('../../tools');
const {
	website,
	supportInvite,
	creatorID,
	inviteLink,
} = require('../../../assets/config/settings.json');
const { primary } = require('../../../assets/config/colors.json');

module.exports.run = async ({ client, message, guildData: guild }) => {
	const e = new MessageEmbed()
		.setURL(website)
		.setColor(primary)
		.setTitle(client.user.username)
		.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
		.setDescription(
			`**Username**: <@!${client.user.id}> \n**Creator**: <@!${creatorID}> \n**Guilds**: ${client.guilds.cache.size} \n\n• [Invite ${client.user.username}](${inviteLink}) \n• [Join Support Server](https://discord.gg/${supportInvite})\n• [Vote for ${client.user.username}s](https://top.gg/bot/${client.user.id}) \n• [${client.user.username}s Website](${website})`,
		)
		.setFooter(`Uptime: ${formatTimeSince(client.uptime)}`)
		.setTimestamp();
	return message.channel.send(e);
};

module.exports.config = {
	name: 'bot-info',
	aliases: ['bot-information', 'b-i'],
};
