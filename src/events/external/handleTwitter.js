const state = {
	ids: [],
	notify: [],
	reload: false,
};
const Twit = require('twit');
const { client } = require('../../bot');
const log = require('../../utils/logger');
const { getNotifications, getUUID } = require('../../models/notifications');

// Setup twitter client
const twitterClient = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_SECRET,
	timeout_ms: 60 * 1000,
	strictSSL: true,
});
module.exports.twitterClient = twitterClient;

// Connected
function error(err) {
	log.client.error('I do not know there was a Twitter Error...');
	log.client.error(`- ${err}`);
}

const recentTweets = [];
async function handleTweet(tweet) {
	// Make sure tweet is by followed user
	if (!state.ids.includes(tweet.user.id_str)) return;

	// Make sure tweet isn't duplicate
	if (recentTweets.includes(tweet.id_str)) return;
	recentTweets.push(tweet.id_str);
	if (recentTweets.length > 20) recentTweets.shift();

	// Make sure the thread response is by the real user
	if (
		tweet.in_reply_to_user_id_str &&
		tweet.in_reply_to_user_id_str !== tweet.user.id_str
	) {
		return;
	}

	// Tweet info
	const context = tweet.retweeted_status || tweet;

	// Return replies
	if (context.text.startsWith('RT @')) return;

	// Get channels to post to
	const rawNotifications = await getUUID('twitter', context.user.id_str);

	// Go through and post tweets
	for (const notify of rawNotifications) {
		// Get guild
		const guild = client.guilds.cache.get(notify.guildID);
		if (!guild) continue;

		// Get channel
		const channel = guild.channels.cache.get(notify.channelID);
		channel.send(
			`${client.emojis.cache.get('817113092492099584')} | **${
				context.user.name
			} (@${
				context.user.screen_name
			})** has just tweeted! Go check it out >> https://twitter.com/${
				context.user.screen_name
			}/status/${context.id_str}`,
		);
	}
}

// Connecting
function connect() {
	log.client.debug('Starting twitter client');
	state.reload = false;

	// Destroy any remaining twitter streams
	if (client.stream && client.stream.destroy) client.stream.destroy();

	// Get and set all twitter channel ids
	log.client.debug('Getting twitter accounts from the database');
	getNotifications('twitter')
		.then((feeds) => {
			log.client.info(`${feeds.length} feed records`);

			// Store the ids
			state.ids = feeds.map((x) => x.uuid);
			if (!state.ids.length) {
				log.client.info(
					'no feed records found, aborted connection to twitter.',
				);
				return;
			}

			// Connect to twitter
			log.client.info('connecting to Twitter...');
			twitterClient
				.stream('statuses/filter', {
					follow: state.ids,
				})
				.on('connected', () => {
					log.client.info('Successfully connected to Twitter');
				})
				.on('tweet', (tweet) => handleTweet(tweet))
				.on('error', (err) => error(err));
		})
		.catch((err) => {
			log.database.error('There was an error getting twitter records');
			log.database.error(err);
		});
}
// Update reloads
setInterval(() => {
	if (!state.reload) return;
	log.client.debug('Triggering client reconnect');
	log.client.info('Scheduled restart of Twitter Client');
	connect();
}, 300000);

module.exports.connect = connect;
