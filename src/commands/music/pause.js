const { musicEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	if (!queue.playing) {
		return message.channel.send(
			improperUsage('There are no songs currently playing.'),
		);
	}

	queue.dispatcher.pause();
	queue.playing = false;
	return message.channel.send(
		musicEmbed('Music Paused', 'The music has been paused.'),
	);
};

module.exports.config = {
	name: 'pause',
	isPlaying: true,
};
