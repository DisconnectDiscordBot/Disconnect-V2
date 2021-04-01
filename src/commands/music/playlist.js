const ytpl = require('ytpl');
const yts = require('yt-search');
const { Util } = require('discord.js');
const log = require('../../utils/logger');
const { getData } = require('spotify-url-info');
const { improperUsage, musicEmbed } = require('../../utils/embed');

async function manageQueue(client, message, channel, video) {
	const serverQueue = client.queue.get(message.guild.id);

	// Create queue track
	const track = {
		id: video.id ? video.id : video.videoId,
		title: Util.escapeMarkdown(video.title),
		views: video.views ? video.views : '-',
		ago: video.ago ? video.ago : '-',
		duration: video.duration,
		url: `https://www.youtube.com/watch?v=${
			video.id ? video.id : video.videoId
		}`,
		img: video.thumbnail,
		req: message.author,
	};

	// Check queue
	if (!serverQueue) {
		// Create queue
		const queueItem = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			dispatcher: null,
			songs: [track],
			volume: 50,
			playing: false,
			loop: false,
			filters: [],
		};
		client.queue.set(message.guild.id, queueItem);

		// Play the song
		const { play } = require('../../utils/play');
		const connection = await channel.join().catch((err) => {
			client.queue.delete(message.guild.id);
			message.channel.send(
				improperUsage(`I was unable to join the voice channel: ${err}`),
			);
			return log.client.error(`Unable to join voice channel: ${err}`);
		});
		if (!connection) return await channel.leave();
		await connection.voice.setSelfDeaf(true);

		// Set queue
		queueItem.connection = connection;
		play(queueItem);
	} else {
		// Add song to queue
		serverQueue.songs.push(track);
	}

	return;
}

module.exports.run = async ({ client, args, message }) => {
	// Check voice channel
	const channel = message.member.voice.channel;
	if (!channel) {
		return message.channel.send(
			improperUsage('Please join a voice channel to use this command.'),
		);
	}

	// Get server queue
	const serverQueue = client.queue.get(message.guild.id);

	// Check Permissions
	if (!serverQueue || !serverQueue.voiceChannel) {
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send(
				improperUsage('I am unable to connect to your voice channel.'),
			);
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send(
				improperUsage('I am unable to speak in your voice channel.'),
			);
		}
	}

	// Search and URL
	const search = args.join(' ');
	if (!search) {
		return message.channel.send(
			improperUsage('Please provide a song you would like to play'),
		);
	}
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';

	// Get Song
	if (/^.*(youtu.be\/|list=)([^#&?]*).*/gi.test(url)) {
		// Manage playlist links
		const playlist = await ytpl(
			url.split('list=')[1].split('&index=')[0],
		).catch();
		if (!playlist) {
			return message.channel.send(
				improperUsage('I could not find a playlist with that url'),
			);
		}

		// Get videos
		const videos = await playlist.items;

		// Add videos to queue
		for (const video of videos) {
			manageQueue(client, message, channel, video);
		}

		// Send confirmation
		return message.channel.send(
			musicEmbed(
				'Playlist Added to Queue',
				`Successfully added ${playlist.title} to queue with ${playlist.items.length} songs!`,
			),
		);
	} else if (
		url.match(
			/(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(playlist|album)[/:]([A-Za-z0-9]+)/,
		)
	) {
		// Manage spotify playlists
		const playlist = await getData(url).catch();
		if (!playlist) {
			return message.channel.send(
				improperUsage(
					'I was unable to find the playlist with that link.',
				),
			);
		}

		// Handle tracks
		const tracks = [];
		message.channel.send(
			musicEmbed(
				'Searching for tracks',
				`Searching for songs... This may take a moment. Expected time... ${
					playlist.tracks.items.length > 50
						? '50'
						: playlist.tracks.items.length
				} seconds.`,
			),
		);

		let i = 1;
		for (const song of playlist.tracks.items) {
			if (i > 50) {
				return;
			}

			const results = await yts.search(
				`${song.track.artists[0].name} - ${song.track.name} lyrics`,
			);
			if (!results || results.length < 1) {
				continue;
			}
			tracks.push(results.all[0]);
			i++;
		}

		for (const track of tracks) {
			await manageQueue(client, message, channel, track);
		}

		return message.channel.send(
			musicEmbed(
				'Playlist Added to Queue',
				`Successfully added \`${playlist.name}\` with ${tracks.length} songs to the queue.`,
			),
		);
	} else {
		// Search youtube playlists
		const found = await yts.search(search);
		if (found.playlists.length === 0) {
			return message.channel.send(
				improperUsage('I could not find and playlists on YouTube.'),
			);
		}

		// Get information
		const playlistInfo = found.playlists[0];
		const playlist = await ytpl(playlistInfo.listId);
		const videos = await playlist.items;

		// Add videos to queue
		for (const video of videos) {
			manageQueue(client, message, channel, video);
		}

		// Send confirmation
		return message.channel.send(
			manageQueue(
				'Playlist Added to Queue',
				`Successfully added ${playlistInfo.title} to the queue with ${playlistInfo.videoCount} tracks!`,
			),
		);
	}
};

module.exports.config = {
	name: 'play-playlist',
	aliases: ['p-p', 'playlist'],
};
