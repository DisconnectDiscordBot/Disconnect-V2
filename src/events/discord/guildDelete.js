// Variables
const { client } = require('../../bot');
const logger = require('../../utils/logger');
const { get: getGuild } = require('../../models/guilds');

// On error
client.on('guildDelete', async (guild) => {
	logger.client.info(`I have left a guild. Guild ID: ${guild.id}`);

	// Cache Data
	await getGuild(guild);

	// Alert us of the new guild
	const channel = client.guilds.cache
		.get('713612836961648680')
		.channels.cache.get('733501515112906885');
	if (channel)
		await channel.send(
			`__I have left a guild!__ 😢😢 *Information below*: \n**Guild Name**: ${guild.name} \n**Guild ID**: ${guild.id} \n**Guild Member Count**: ${guild.memberCount}`,
		);
});
