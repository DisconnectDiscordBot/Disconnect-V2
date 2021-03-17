const { client } = require('../../bot');
const logger = require('../../utils/logger');
const { fetchMember } = require('../../tools');
const { createSuccessEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	let member;
	if (args[0]) {
		member = fetchMember(message, args[0]);
	}
	if (!member || typeof member !== 'object') {
		return message.channel.send(
			improperUsage(
				'Please specify a user you would like to ban. \nIf you do not want to ping them you may use their id.',
			),
		);
	}

	if (member.user.id === client.user.id) {
		return message.channel.send(
			improperUsage('How mean. You want to ban me? I wont ban myself :('),
		);
	}

	if (member.user.id === message.author.id) {
		return message.channel.send(
			improperUsage(
				'If you wish to leave the guild, I can not help you.',
			),
		);
	}

	if (member.user.id === message.guild.ownerID) {
		return message.channel.send(
			improperUsage('You may not ban the owner of the guild.'),
		);
	}

	const clientMember = message.guild.members.cache.get(client.user.id);
	if (
		member.kickable === false ||
		clientMember.roles.highest.rawPosition <=
			member.roles.highest.rawPosition
	) {
		return message.channel.send(
			improperUsage('I am unable to ban this member from the guild.'),
		);
	}

	if (
		message.member.roles.highest.rawPosition <=
		member.roles.highest.rawPosition
	) {
		return message.channel.send(
			improperUsage(
				'You can not ban someone with higher permissions than you.',
			),
		);
	}

	let reason = args.slice(1).join(' ');
	reason = `${message.author.tag} Successfully banned ${member.user.tag}. ${
		!reason ? 'No reason was provided why.' : `Reason for ban: ${reason}`
	}`;

	try {
		await member.ban({ reason });
	} catch (err) {
		logger.client.error(err);
		return message.channel.send(
			improperUsage(
				'There was an error trying to ban this member. Please try again later.',
			),
		);
	}

	return message.channel.send(createSuccessEmbed(reason));
};

module.exports.config = {
	name: 'ban',
	permissions: ['BAN_MEMBERS'],
	clientPerms: ['BAN_MEMBERS'],
};
