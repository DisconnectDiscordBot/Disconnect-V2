const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	queue.loop = !queue.loop ? true : !queue.loop;
	return message.channel.send(
		musicEmbed(
			`Loop ${queue.loop ? 'Enabled' : 'Disabled'}`,
			`The loop has been ${queue.loop ? 'enabled' : 'disabled'}.`,
		),
	);
};

module.exports.config = {
	name: 'loop',
	isPlaying: true,
};
