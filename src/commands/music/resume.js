const { musicEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	if (queue.playing) {
		return message.channel.send(
			improperUsage('The music is already playing.'),
		);
	}

	queue.dispatcher.resume();
	queue.playing = true;
	return message.channel.send(
		musicEmbed('Music Resumed', 'The music is now continuing...'),
	);
};

module.exports.config = {
	name: 'resume',
	isPlaying: true,
};
