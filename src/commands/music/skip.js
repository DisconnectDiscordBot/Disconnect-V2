const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	queue.dispatcher.end();
	return message.channel.send(
		musicEmbed('Song Skipped', 'I have skipped the current song.'),
	);
};

module.exports.config = {
	name: 'skip',
	isPlaying: true,
};
