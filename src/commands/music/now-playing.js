const { musicEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, queue }) => {
	const nowPlaying = queue.songs[0];

	return message.channel.send(
		musicEmbed(
			'Now Playing',
			`[${nowPlaying.title}](${nowPlaying.url}) *requested by ${nowPlaying.req.username}*`,
		),
	);
};

module.exports.config = {
	name: 'now-playing',
	isPlaying: true,
	aliases: 'n-p',
};
