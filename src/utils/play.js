const log = require('./logger');
const { SOUNDCLOUD_ID } = process.env;
const { client } = require('../bot');
const availableFilters = require('./filters.json');
const scdl = require('soundcloud-downloader').default;
const { YouTubePlayer, ExternalPlayer } = require('./player');
const { existsSync, unlink, createReadStream } = require('fs');
const { musicEmbed, improperUsage } = require('./embed');

// Play module
module.exports.play = async (queue, update, refresh) => {
	// Get settings
	const seek = update ? queue.dispatcher.streamTime : null;
	const filters = [];
	for (const filter of queue.filters) {
		if (filters === []) {
			filters.push('-af');
		}
		filters.push(availableFilters[filter]);
	}
	const encoder = filters.length ? ['-af', filters.join(',')] : [];

	// Get song
	const song = queue.songs[0];
	if (update && !refresh) {
		await queue.dispatcher.end();
		queue.update = true;
		return;
	} else if (update && refresh) {
		queue.update = false;
	}

	// Make sure there is a song
	if (!song) {
		queue.textChannel.send(
			'Leaving the voice channel as queue looks a bit empty...',
		);
		queue.textChannel.guild.me.voice.channel.leave();
		return client.queue.delete(queue.textChannel.guild.id);
	}

	// Setup stream
	let stream = null;
	let streamType = 'opus';

	// Setup stream
	if (song.isFile) {
		// Manage Files
		if (!existsSync(song.file)) return;
		stream = createReadStream(`./temp/${song.title}.mp3`);
		streamType = 'unknown';
	} else if (song.url.includes('youtube.com')) {
		// Manage YouTube player
		if (song.isLive) {
			try {
				stream = await YouTubePlayer(song.url, {
					quality: 'highestaudio',
					highWaterMark: 1 << 25,
					type: streamType,
					seek: undefined,
					opusEncoded: true,
				});
			} catch (err) {
				queue.songs.shift();
				this.play(queue);
				log.client.error(err);
				return queue.textChannel.send(
					improperUsage(
						`An unexpected error has occurred.\nPossible type \`${err}\``,
					),
				);
			}
		} else {
			try {
				stream = await YouTubePlayer(song.url, {
					quality: 'highestaudio',
					filter: 'audioonly',
					highWaterMark: 1 << 25,
					type: streamType,
					encoderArgs: encoder,
					seek: seek / 1000,
					opusEncoded: true,
				});
			} catch (err) {
				queue.songs.shift();
				this.play(queue);
				log.client.error(err);
				return queue.textChannel.send(
					improperUsage(
						`An unexpected error has occurred.\nPossible type \`${err}\``,
					),
				);
			}
		}
		stream.on('error', (err) => {
			queue.songs.shift();
			this.play(queue);
			log.client.error(err);
			return queue.textChannel.send(
				improperUsage(
					`An unexpected error has occurred.\nPossible type \`${err}\``,
				),
			);
		});
	} else if (song.url.includes('soundcloud.com')) {
		// Manage sound cloud player
		try {
			stream = ExternalPlayer(
				await scdl.downloadFormat(
					song.url,
					scdl.FORMATS.OPUS,
					SOUNDCLOUD_ID,
				),
				{
					opusEncoded: true,
					encoderArgs: encoder,
					seek: seek / 1000,
				},
			);
		} catch (err) {
			queue.songs.shift();
			this.play(queue);
			log.client.error(err);
			return queue.textChannel.send(
				improperUsage(
					`An unexpected error has occurred.\nPossible type \`${err}\``,
				),
			);
		}
	}

	// Attempting to solve FFmpeg error
	if (queue.dispatcher) {
		await queue.dispatcher.destroy();
	}

	// Delete queue on disconnection
	queue.connection.on('disconnect', () =>
		client.queue.delete(queue.textChannel.guild.id),
	);

	setTimeout(async () => {
		// Setup dispatcher
		const dispatcher = queue.connection
			.play(stream, { type: streamType })
			.on('finish', () => {
				setTimeout(() => {
					if (queue.update) {
						this.play(queue, true, true);
					} else {
						if (queue.npMsg) {
							try {
								queue.npMsg.delete();
							} catch (err) {
								// The bot could not delete the message... I don't want to do anything here...
							}
						}
						const shift = queue.songs.shift();
						if (queue.loop) {
							queue.songs.push(shift);
						} else if (shift.isFile) {
							unlink(shift.file, function (err) {
								if (err && err.code == 'ENOENT') {
									log.client.error(
										'Error file could not be found.',
									);
								} else if (err) {
									log.client.error(
										'Error occurred while trying to remove file',
									);
								}
							});
						}
						this.play(queue);
					}
				}, 200);
			})
			.on('error', (err) => {
				queue.songs.shift();
				queue.textChannel.send(
					improperUsage(
						`An unexpected error has occurred.\nPossible type \`${err}\``,
					),
				);
				log.client.error(err);
				return this.play(queue);
			});
		queue.dispatcher = dispatcher;
		queue.playing = true;

		// Set volume and send play message
		dispatcher.setVolumeLogarithmic(queue.volume / 100);
		if (!update) {
			queue.npMsg = await queue.textChannel.send(
				musicEmbed(
					'Now Playing',
					`[${song.title}](${song.url}) is now playing. Requested by ${song.req.username}`,
				),
			);
		}
	}, 1000);
};
