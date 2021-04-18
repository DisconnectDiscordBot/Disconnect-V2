const agent = require('superagent');
const { client } = require('../../bot');
const log = require('../../utils/logger');

// Only run this script if this is on a production client
if (!client.isProduction) return;

// Send a post request to update bot's stats
setInterval(async () => {
	await agent
		.post(`https://top.gg/api/bots/${client.user.id}/stats`)
		.set({ Authorization: process.env.TOPGG })
		.send({ server_count: client.guild.cache.size })
		.then(log.info('Stats Posted!'))
		.catch((err) => log.error(err));
}, 30 * 60 * 1000);
