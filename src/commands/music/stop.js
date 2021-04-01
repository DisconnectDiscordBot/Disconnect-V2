const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ client, message, queue }) => {
	if (
		!queue.connection ||
		!queue.connection.dispatcher ||
		!queue.dispatcher
	) {
		return;
	}

	try {
		queue.connection.dispatch.end();
	} catch (err) {
		message.guild.me.voice.channel.leave();
		client.queue.delete(message.guild.id);
		return message.channel.send(
			musicEmbed(
				'Music Stopped',
				'The music player has been halted and queue has been cleared.',
			),
		);
	}

	client.queue.delete(message.guild.id);
	const shift = queue.songs.shift();
	queue.songs = [shift];
	message.react('✅');
};

module.exports.config = {
	name: 'stop',
	isPlaying: true,
};
