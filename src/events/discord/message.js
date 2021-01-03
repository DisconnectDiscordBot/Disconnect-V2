// Variables
const { MessageEmbed } = require('discord.js');
const { client } = require('../../bot');
const settings = require('../../../assets/config/settings.json');

// On Message
client.on('message', async (message) => {
	// Deconstruct message
	const { author, content, channel, guild } = message;

	// XP System
	// Economy System
	// Pre Command Checks
	if (author.bot || channel.type == 'dm') return;

	// Get guild data
	const { get: getGuild } = require('../../models/guilds');
	const guildData = await getGuild(guild);

	// Define information
	const mention = `<@!${client.user.id}>`;
	const prefix = guildData.prefix ? guildData.prefix : settings.prefix;
	const args = content.slice(prefix.length).trim().split(' ');

	// If it starts with a ping
	if (content.startsWith(mention)) {
		return message.channel.send(
			`Hello, I am **${client.user.username}**! Please use \`${prefix}help\` for help!`,
		);
	}

	// If it doesn't start with prefix return;
	if (!content.startsWith(prefix)) return;

	// Remove spaces
	for (arg of args) {
		if (arg === '') args.splice(args.indexOf(arg), 1);
	}

	// Get the command
	const cmd = args.shift().toLowerCase();
	const command = client.commands.get(cmd) || client.aliases.get(cmd);
	if (!command) return;

	// Check permissions

	// Temp User Data
	const userData = {
		premium: false,
	};

	// Run Execute the command
	command.run({ client, message, args, guildData, userData }).catch((err) => {
		console.log(err);
		message.reply('An error has occurred.');
	});
});
