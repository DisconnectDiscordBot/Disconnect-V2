const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	try {
		await message.guild.me.voice.channel.leave(0);
	} catch (err) {
		await message.guild.me.voice.kick(message.guild.me.id);
		return message.channel.send(
			musicEmbed(
				'Disconnecting...',
				'I am trying to leave the voice channel...',
			),
		);
	}

	return message.channel.send(
		musicEmbed('Disconnected...', 'I have left the voice channel.'),
	);
};

module.exports.config = {
	name: 'leave',
	isPlaying: true,
	aliases: ['disconnect', 'go-away'],
};
