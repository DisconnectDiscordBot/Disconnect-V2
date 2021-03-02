// Variables
const { client } = require('../../bot');
const request = new (require('rss-parser'))();
const { getChannels } = require('../../models/notifications');
const { getLinks, model: addVideo } = require('../../models/links');

// Every 3 minutes check
setInterval(async () => {
	const videos = await getLinks('youtube');
	const channels = await getChannels('youtube');

	for (const channel of channels) {
		// Get Videos
		if (!channel.uuid) continue;
		const data = await request.parseURL(
			`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.uuid}`,
		);

		// Latest video
		if (!data || !data.items.length) continue;
		const latestVideo = data.items[0];

		if (
			new Date() - new Date(latestVideo.isoDate) > 3.6e6 ||
			videos.includes(latestVideo.link)
		) {
			continue;
		}

		// Get channel
		if (!channel.guildID || !channel.channelID) continue;

		const guild = await client.guilds.cache.get(channel.guildID);
		if (!guild) continue;

		const guildChannel = await guild.channels.cache.get(channel.channelID);
		if (
			!guildChannel ||
			!guildChannel.permissionsFor(client.user).has('SEND_MESSAGES')
		) {
			continue;
		}

		// Send message
		guildChannel.send(
			`${client.emojis.cache.get('798300331569971207')} | **${
				latestVideo.author
			}** has uploaded a new video!! Go check it out >> ${
				latestVideo.link
			}`,
		);

		// Save to database
		new addVideo({
			type: 'youtube',
			created: Date.now(),
			url: latestVideo.link,
			deleteAfter: Date.now() + 1.08e7,
		}).save();
	}
}, 30000);
