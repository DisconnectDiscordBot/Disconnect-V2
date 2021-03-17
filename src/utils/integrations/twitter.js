const { twitterClient } = require('../../events/external/handleTwitter');
const log = require('../logger');

module.exports.getTwitterUser = async (screenName) => {
	let res = null;
	try {
		res = await twitterClient.get('users/lookup', {
			screen_name: screenName,
		});
	} catch (err) {
		log.client.error(`Twitter: ${err}`);
		return null;
	}

	return res.data[0] || null;
};
