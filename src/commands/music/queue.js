const { musicEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, queue, guildData }) => {
	// Check and make sure user is in a voice channel
	const channel = message.member.voice.channel;
	if (!channel) {
		return message.channel.send(
			improperUsage('Please join a voice channel to use this command.'),
		);
	}

	// Make sure bot is in a voice channel
	if (!message.guild.me.voice.channel) {
		return message.channel.send(
			improperUsage(
				'I am not currently playing music in a voice channel.',
			),
		);
	}

	// Check if there is a queue
	if (!queue) {
		return message.channel.send(
			improperUsage(
				`There is no music playing in this server. Use \`${
					guildData.prefix ? guildData.prefix : '!'
				}play <song name or url>\` to play some music!`,
			),
		);
	}

	// Creating queue info
	const nowPlaying = queue.songs[0];
	const next = queue.songs.slice(1, 11);
	const playingNext = [];

	// Sort out tracks
	let i = 1;
	for (const track of next) {
		playingNext.push(`\`${i++})\` ${track.title}`);
	}

	const queuemsg = `**Now Playing**: ${
		nowPlaying.title
	} \n**Playing Next**: *(${next.length}/${
		queue.songs.length - 1
	})*\n${playingNext.join('\n')}`;

	return message.channel.send(
		musicEmbed(`${message.guild.name} Queue`, queuemsg),
	);
};

module.exports.config = {
	name: 'queue',
	aliases: 'q',
	isPlaying: true,
};
