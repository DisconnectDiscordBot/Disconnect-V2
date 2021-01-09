const {
	supportInvite,
	prefix,
} = require('../../../assets/config/settings.json');

module.exports.run = async ({ message, guildData: guild }) => {
	return message.channel.send(
		`Hello, I am Disconnect! How may I help you?\nThis servers prefix is: \`${
			guild.prefix ? guild.prefix : prefix
		}\`\n\n**Looking for support?**\nJoin our support server at https://discord.gg/${supportInvite}\n\n**Looking for a command list?**\nCheck them out at <https://disconnectbot.com/commands> or use \`${
			guild.prefix ? guild.prefix : prefix
		}commands\` \n\n *Still want more information? Check out our FAQ or use \`${
			guild.prefix ? guild.prefix : prefix
		}bot-info\`*`,
	);
};

module.exports.config = {
	name: 'help',
};
