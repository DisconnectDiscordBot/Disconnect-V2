// Variables
const { client } = require('../../bot');
const logger = require('../../utils/logger');

// On error
client.on('error', async (err) => {
	return logger.client.error(err);
});

// On warn
client.on('error', async (warning) => {
	return logger.client.error(warning);
});

// On Rate-limit
client.on('rateLimit', async (rl) => {
	setTimeout(
		logger.client.error(
			`Rate Limit, Time out \`${rl.timeout}ms\`. Limit: \`${rl.limit}\`, and Information ${rl.method}. Misc ${rl.path} ${rl.route}`,
		),
		rl.timeout + 10,
	);
});
