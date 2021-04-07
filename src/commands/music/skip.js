const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	if (Q)
	queue.dispatcher.end();
	return message.channel.send(
		musicEmbed('Song Skipped', 'I have skipped the current song.'),
	);
};

module.exports.config = {
	name: 'skip',
	isMusic: true,
};
