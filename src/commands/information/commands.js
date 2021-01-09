const { website, prefix } = require('../../../assets/config/settings.json');
const { commands } = require('../../../assets/responses/commands.json');
const {
	categories: translate,
} = require('../../../assets/responses/translation.json');

module.exports.run = async ({ client, message, guildData: guild }) => {
	const categories = [];

	// Get all commands sorted
	for (const category of Object.keys(commands)) {
		const commandsFound = commands[category];

		categories.push(
			`**${translate[category]}** \n\`${commandsFound.join('`, `')}\``,
		);
	}

	// Send message
	return message.channel.send(
		`__Disconnect Command List__ \n*${
			client.commands.size
		} commands found...* \n\n${categories.join(
			'\n\n',
		)} \n\n**Want more detailed information?** \nCheck out <${website}commands.html> or use \`${
			guild.prefix ? guild.prefix : prefix
		}command-info [command]\``,
	);
};

module.exports.config = {
	name: 'commands',
	aliases: 'command-list',
};
