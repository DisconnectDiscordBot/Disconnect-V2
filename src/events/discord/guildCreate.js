// Variables
const { client } = require('../../bot');
const logger = require('../../utils/logger');
const { get: getGuild } = require('../../models/guilds');

// On error
client.on('guildCreate', async (guild) => {
	logger.client.info(`I have joined a new guild. Guild ID: ${guild.id}`);

	// Cache Data
	await getGuild(guild);

	// Alert us of the new guild
	const channel = client.guilds.cache
		.get('713612836961648680')
		.channels.cache.get('733501515112906885');
	if (channel)
		await channel.send(
			`__**I have joined a new guild!**__ 🎉🎉 \n**Name**: ${guild.name} \n**ID**: \`${guild.id}\` \n**Member Count**: ${guild.memberCount}`,
		);
});
