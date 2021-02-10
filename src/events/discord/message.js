// Variables
const { client } = require('../../bot');
const logger = require('../../utils/logger');
const { improperUsage, missingPermissions } = require('../../utils/embed');
const settings = require('../../../assets/config.json');

// On Message
client.on('message', async (message) => {
	// Deconstruct message
	const { author, content, channel, guild } = message;

	// Pre Command Checks
	if (author.bot || channel.type == 'dm') return;

	// Pre command permission checks
	if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		return;
	}

	if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
		return message.channel.send(
			'Many of my responses require permission to embed links. Please give me permission to do this if you would like me to run this command.',
		);
	}

	// Get guild data
	const { get: getGuild } = require('../../models/guilds');
	const guildData = await getGuild(guild);

	// Get User Data
	const { get: getUser } = require('../../models/users');
	const userData = await getUser(author);

	// XP System
	// Economy System

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
	if (!content.startsWith(prefix) || !args[0]) return;

	// Remove spaces
	for (arg of args) {
		if (arg === '') args.splice(args.indexOf(arg), 1);
	}

	// Get the command
	const cmd = args.shift().toLowerCase();
	const command = client.commands.get(cmd) || client.aliases.get(cmd);
	if (!command) return;

	// Check permissions
	const member = message.member;
	const clientMember = message.guild.members.cache.get(client.user.id);

	// Make sure bot is able to respond
	if (
		!clientMember.hasPermission('SEND_MESSAGES') ||
		!clientMember.hasPermission('EMBED_LINKS')
	) {
		return;
	}

	// Check user permissions
	if (command.config.permissions) {
		const missing = [];

		for (const permission of command.config.permissions) {
			if (!message.channel.permissionsFor(message.author).has(permission))
				missing.push(permission);
		}

		if (missing.length > 0) {
			return message.channel.send(missingPermissions('You are', missing));
		}
	}

	// Check client permissions
	if (command.config.clientPerms) {
		const missing = [];

		for (const permission of command.config.clientPerms) {
			if (!message.channel.permissionsFor(client.user).has(permission))
				missing.push(permission);
		}

		if (missing.length > 0) {
			return message.channel.send(missingPermissions('I am', missing));
		}
	}
	// Check NSFW
	if (command.config.isNSFW && channel.nsfw === false) {
		return message.channel.send(
			improperUsage('This command may only be used in nsfw channels.'),
		);
	}
	// Run Execute the command
	command.run({ client, message, args, guildData, userData }).catch((err) => {
		logger.client.error(
			`${err} While trying to use command ${command.config.name} in command ${message.guild.id}`,
		);
		return message.channel.send(
			improperUsage(
				'An error has occurred while running the command. Please try again later.',
			),
		);
	});
});
