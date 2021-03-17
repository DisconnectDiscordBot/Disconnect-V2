const agent = require('superagent');
const log = require('../logger');

module.exports.getYouTubeChannel = async (screenName) => {
	const results = await agent
		.get(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${screenName}&key=${process.env.YOUTUBE_KEY}&maxResults=1&type=channel`,
		)
		.catch((err) => {
			log.client.error(`Error getting YouTube channel: ${err}`);
			return 'error';
		});

	if (!results || !results.body || !results.body.items[0]) return null;
	return results.body.items[0];
};
